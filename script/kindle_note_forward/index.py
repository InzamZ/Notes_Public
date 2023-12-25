import requests
import os
import sys
import argparse
from bs4 import BeautifulSoup
from hashlib import md5

import pymongo
from pymongo import MongoClient


def main():
    args = parse_cmd_args(sys.argv[1:])
    notes = export_note(args.html_path)
    if args.push_github:
        export_markdown(notes, args.markdown_path)
    if args.push_atlas:
        push_to_atlas(notes, args.atlas_uri)
    if args.set_vitepress:
        set_vitepress(notes)


# 在公共的 github 仓库中下载 kindle 导出的 HTML 书摘
def download_booknote(lists_file_url: str):
    resp = requests.get(lists_file_url)
    if resp.status_code != 200:
        return None
    lists_file = resp.text
    lists = lists_file.split("\n")
    booknote_download_success = []
    for url in lists:
        if url == "":
            continue
        print("download: " + url)
        resp = requests.get(url)
        if resp.status_code != 200:
            continue
        # 文件名需要通过 url 解码
        file_name = url.split("/")[-1]
        file_name = requests.utils.unquote(file_name)
        # 保存文件在当前目录下的子文件夹 notebook_html 中
        file_path = "notebook_html/" + file_name
        # 如果文件夹不存在则创建
        if not os.path.exists("notebook_html"):
            os.makedirs("notebook_html")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(resp.text)
        booknote_download_success.append(file_name)
        print("download success: " + file_name)


def export_note(kindle_note_path: str):
    # 遍历 notebook_html 文件夹中的文件
    origin_html_path: str = os.path.abspath(kindle_note_path)
    json_data: dict = {}
    for file_name in os.listdir(origin_html_path):
        file_path = origin_html_path + "/" + file_name
        with open(file_path, "r", encoding="utf-8") as f:
            html = f.read()
        soup = BeautifulSoup(html, "html.parser")
        # 获取书名
        book_name = soup.find("div", class_="bookTitle").text.strip()
        # 获取作者
        author = soup.find("div", class_="authors").text.strip()
        # 获取书摘
        note_headings = soup.find_all("div", class_="noteHeading")
        last_chapter: str = ""
        book_notes: list = []
        for note_heading in note_headings:
            # 获取书摘标题
            if note_heading.find("span") is None:
                continue
            if note_heading.find("span").text.strip() == "":
                continue
            highlight_color = note_heading.find("span").text.strip()
            note_heading_text = note_heading.text.strip()
            # 获取书摘内容
            note_content = note_heading.find_next_sibling(
                "div", class_="noteText"
            ).text.strip()
            # 获取书摘位置
            note_position = note_heading_text[note_heading_text.find("位置 ") + 3 :]
            # 获取章节名
            note_chapter = note_heading_text[
                note_heading_text.find(" - ") + 3 : note_heading_text.find(" > 位置")
            ]
            # 获取书摘的笔记
            next_note_heading = note_heading.find_next_sibling(
                "div", class_="noteHeading"
            )
            comments = ""
            if next_note_heading.text.find("笔记") != -1:
                comments_div = next_note_heading.find_next_sibling(
                    "div", class_="noteText"
                )
                comments = comments_div.text.strip() if comments_div else ""
            print(f"export: {highlight_color}  {note_position} {note_content}")
            if comments != "":
                print(f"export: {note_chapter} {note_position} {comments}")
            book_notes.append(
                {
                    "color": highlight_color,
                    "position": note_position,
                    "content": note_content,
                    "comments": comments,
                    "chapter": note_chapter,
                    "from": book_name,
                    "author": author,
                }
            )
        json_data[book_name] = book_notes
        print("export success: " + book_name)
    return json_data


def parse_cmd_args(args):
    parser = argparse.ArgumentParser()
    parser.add_argument("--push_github", action="store_true", help="push to github")
    parser.add_argument("--push_atlas", action="store_true", help="push to atlas")
    parser.add_argument(
        "--markdown_path", type=str, default="kindle_note", help="markdown path"
    )
    parser.add_argument(
        "--html_path", type=str, default="kindle_note/origin", help="html path"
    )
    parser.add_argument(
        "--atlas_uri",
        type=str,
        default="mongodb://localhost:27017/",
        help="mongodb atlas uri",
    )
    parser.add_argument("--set_vitepress", action="store_true", help="set vitepress")
    return parser.parse_args(args)


def export_markdown(notes: dict, markdown_path: str):
    # 遍历 notebook_html 文件夹中的文件
    markdown_path = os.path.abspath(markdown_path)
    # 如果文件夹不存在则创建
    if not os.path.exists(markdown_path):
        os.makedirs(markdown_path)
    for book in notes.keys():
        book_notes = notes[book]
        # 获取书名
        book_name = book_notes[0]["from"]
        # 获取作者
        author = book_notes[0]["author"]
        # 保存文件在当前目录下的子文件夹 notebook 中
        file_path = f"{markdown_path}/{book_name}.md"
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(f"# {book_name} - {author}\n\n")
            last_chapter = ""
            for book_note in book_notes:
                # 获取书摘标题
                highlight_color = book_note["color"]
                # 获取书摘内容
                note_content = book_note["content"]
                # 获取书摘位置
                note_position = book_note["position"]
                # 获取章节名
                note_chapter = book_note["chapter"]
                # 获取书摘的笔记
                note_comments = book_note["comments"]
                # 判断是否是新的章节
                if note_chapter != last_chapter:
                    f.write(f"## {note_chapter} \n\n")
                    last_chapter = note_chapter
                # 写入文件
                f.write(f"### color: {highlight_color} pos: {note_position} \n\n")
                f.write(f"> {note_content}\n\n")
                if note_comments:
                    f.write(f"---\n\n> COMMENTS: {note_comments} \n\n")


def push_to_atlas(notes_dict: dict, atlas_uri):
    client = MongoClient(atlas_uri)
    db = client.get_database("BooksNotes")
    for book_name in notes_dict.keys():
        notes_list = notes_dict[book_name]
        collections = db.get_collection(notes_list[0]["from"])
        for x in notes_list:
            x["contenthash"] = md5(x["content"].encode("utf-8")).hexdigest()
            collections.find_one_and_update(
                {"contenthash": x["contenthash"]}, {"$set": x}, upsert=True
            )
        collections.create_index(
            [("contenthash", pymongo.ASCENDING)], unique=True, name="contenthash"
        )


def set_vitepress(notes_dict: dict):
    config_ts = open("docs/.vitepress/config.ts", "r", encoding="utf-8")
    config_ts = config_ts.read()
    auto_generate_start = config_ts.find("// AUTO-GENERATED-CONTENT:START")
    auto_generate_end = config_ts.find("// AUTO-GENERATED-CONTENT:END")
    config_ts = (
        config_ts[:auto_generate_start]
        + config_ts[auto_generate_end + len("// AUTO-GENERATED-CONTENT:END") :]
    )
    config_ts += "// AUTO-GENERATED-CONTENT:START\n"
    auto_generate_temp = """function kindle_note_sidebar() {
    return [{
        text: 'KindleNotes',
        items: [
            { text: 'KindleNotes', link: '/KindleNotes/' },
            ======AUTO-GENERATED-CONTENT======
        ]
    }]
}"""
    auto_generate_content = "\n".join(
        [
            f"{{ text: '{book_name}', link: '/KindleNotes/{book_name}.html' }},"
            for book_name in notes_dict.keys()
        ]
    )
    config_ts += auto_generate_temp.replace(
        "======AUTO-GENERATED-CONTENT======", auto_generate_content
    )
    config_ts += "\n// AUTO-GENERATED-CONTENT:END"
    with open("docs/.vitepress/config.ts", "w", encoding="utf-8") as f:
        f.write(config_ts)


if __name__ == "__main__":
    main()
