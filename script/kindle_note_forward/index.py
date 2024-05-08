import json
import requests
import os
import sys
import argparse
from bs4 import BeautifulSoup
from hashlib import md5

import pymongo
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import os


# 示例文本1：第 30 页·位置 434
# 示例文本2：01 > 第 9 页·位置 94
def parse_note_heading_text(note_heading_text: str):
    # 通过正则表达式提取位置信息
    chapter, page, position = "", "", ""
    print(f"[parse_note_heading_text] note_heading_text: {note_heading_text}")
    if note_heading_text.find(">") != -1:
        chapter = note_heading_text.split(">")[0].strip()
        note_heading_text = note_heading_text.split(">")[1].strip()
    if note_heading_text.find("页") != -1:
        page = note_heading_text.split("页")[0].split("第")[1].strip()
        note_heading_text = note_heading_text.split("页")[1].strip()
    if note_heading_text.find("位置") != -1:
        position = note_heading_text.split("位置")[1].strip()
    print(f"[parse_note_heading_text] {chapter} {page} {position}")
    return chapter, page, position


# 可以通过 ##KEY##VALUE## 的方式来添加额外信息
def parse_comments(comments):
    extra_info = {}
    new_comments = ""
    comment_lines = comments.split("\n")
    for comment_line in comment_lines:
        if comment_line.find("##") != -1:
            comments_list = comment_line.split("##")
            info_key = comments_list[1].strip().lower()
            info_value = comments_list[2].strip()
            extra_info[info_key] = info_value
        else:
            new_comments += comment_line + "\n"

    return new_comments, extra_info


def export_note(kindle_note_path: str):
    # 遍历 notebook_html 文件夹中的文件
    origin_html_path: str = os.path.abspath(kindle_note_path)
    json_data: dict = {}
    for file_name in os.listdir(origin_html_path):
        if file_name.find(".html") == -1:
            continue
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
            note_heading_text = note_heading.text.strip()
            if note_heading_text.find("标注") == -1:
                print(f"[WARN][{book_name}] noteHeading not found {note_heading_text}")
                continue

            highlight_color = "未知"
            # 获取书摘标题的颜色
            if note_heading.find("span") is None:
                print(f"[WARN][{book_name}] span not found {note_heading.text.strip()}")
            elif note_heading.find("span").text.strip() == "":
                print(f"[WARN][{book_name}] span is empty {note_heading.text.strip()}")
            else:
                highlight_color = note_heading.find("span").text.strip()

            # 获取书摘内容
            next_note_text_div = note_heading.find_next_sibling(
                "div", class_="noteText"
            )
            if next_note_text_div is None:
                print(
                    f"[WARN][{book_name}] noteText not found {note_heading.text.strip()}"
                )
                continue
            note_content = next_note_text_div.text.strip()
            # 获取章节名
            pre_note_heading_div = note_heading.find_previous_sibling(
                "div", class_="sectionHeading"
            )

            note_section = book_name
            if pre_note_heading_div:
                note_section = pre_note_heading_div.text.strip()
            else:
                print(
                    f"[WARN][{book_name}] sectionHeading not found {pre_note_heading_div.text.strip()}"
                )
            # 获取书摘位置
            # 示例文本1：标注(<span class="highlight_blue">蓝色</span>) - 第 30 页·位置 434
            # 示例文本2：标注(<span class="highlight_blue">蓝色</span>) - 01 > 第 9 页·位置 94
            # 使用正则表达式提取位置信息包括三级子标题，页数和位置

            if note_heading_text.find("-") != -1:
                note_heading_text = note_heading_text[note_heading_text.find("-") + 1 :]

            chapter, page, position = parse_note_heading_text(note_heading_text)

            # 获取书摘的笔记
            next_note_heading = note_heading.find_next_sibling(
                "div", class_="noteHeading"
            )
            comments = ""
            extra_info = {}
            if next_note_heading and next_note_heading.text.find("笔记") != -1:
                comments_div = next_note_heading.find_next_sibling(
                    "div", class_="noteText"
                )
                comments = comments_div.text.strip() if comments_div else ""

                # 可以通过 ##KEY##VALUE## 的方式来添加额外信息
                comments, extra_info = parse_comments(comments)
            print(f"export: {highlight_color}  {position} {note_content}")
            if comments != "":
                print(f"export: {note_section} {position} {comments}")
            book_note = {
                "color": highlight_color,
                "position": position,
                "page": page,
                "content": note_content,
                "comments": comments,
                "section": note_section,
                "chapter": chapter,
                "from": book_name,
                "author": author,
            }
            # 合并两个字典
            for key in extra_info:
                book_note[key] = extra_info[key]
            book_notes.append(book_note)
        json_data[book_name] = book_notes
        print("export success: " + book_name)
    return json_data


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
            last_section = ""
            last_chapter = ""
            for book_note in book_notes:
                # 获取书摘标题
                highlight_color = book_note["color"]
                # 获取书摘内容
                note_content = book_note["content"]
                # 获取书摘位置
                note_position = book_note["position"]
                # 获取章节名
                note_section = book_note["section"]
                # 获取子章节名
                note_chapter = book_note["chapter"]
                # 获取书摘的笔记
                note_comments = book_note["comments"]
                note_page = book_note.get("page", "")
                note_position = book_note.get("position", "")
                # 获取引用信息
                note_ref = book_note.get("ref", "")
                note_ref_author = book_note.get("ref_author", "")
                # 判断是否是新的章节
                if note_section != last_section:
                    f.write(f"## {note_section} \n\n")
                    if note_chapter != "":
                        f.write(f"### {note_chapter} \n\n")
                    last_section = note_section
                    last_chapter = note_chapter
                elif note_chapter != "" and note_chapter != last_chapter:
                    f.write(f"### {note_chapter} \n\n")
                    last_chapter = note_chapter

                # 写入文件
                note_title = "标注"
                if note_page != "":
                    note_title += f" > 第 {note_page} 页"
                if note_position != "":
                    note_title += f" - 位置 {note_position}"

                f.write(f":::tip {note_title}\n{note_content}\n:::\n\n")
                if note_ref:
                    if note_ref_author:
                        f.write(
                            f":::info 引用自\n{note_ref} - {note_ref_author}\n:::\n\n"
                        )
                    else:
                        f.write(f":::info 引用自\n{note_ref}\n:::\n\n")
                if note_comments:
                    f.write(f":::warning 笔记\n{note_comments}\n:::\n\n")
                f.write(f"---\n\n")


def push_to_atlas(notes_dict: dict, atlas_uri):
    client = MongoClient(atlas_uri)
    db = client.get_database("BooksNotes")
    for book_name in notes_dict.keys():
        notes_list = notes_dict[book_name]
        collections = db.get_collection(notes_list[0]["from"])
        print(collections, flush=True)
        for x in notes_list:
            x["contenthash"] = md5(x["content"].encode("utf-8")).hexdigest()
            collections.update_one(
                {"contenthash": x["contenthash"]}, {"$set": x}, upsert=True
            )
            if os.environ.get("DEBUG"):
                print(f"push to atlas: {x['contenthash']}")
        collections.create_index(
            [("contenthash", pymongo.ASCENDING)], unique=True, name="contenthash"
        )


def push_favorate_to_atlas(notes_dict: dict, atlas_uri):
    client = MongoClient(atlas_uri)
    client.admin.command("ping")
    db = client.get_database("FavoriteNotes")
    for book_name in notes_dict.keys():
        notes_list = notes_dict[book_name]
        collections = db.get_collection(notes_list[0]["from"])
        print(collections, flush=True)
        for x in notes_list:
            x["contenthash"] = md5(x["content"].encode("utf-8")).hexdigest()
            collections.update_one(
                {"contenthash": x["contenthash"]}, {"$set": x}, upsert=True
            )
            if os.environ.get("DEBUG"):
                print(f"push to atlas: {x['contenthash']}")
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
            { text: 'KindleNotes', link: '/kindlenotes/' },
            ======AUTO-GENERATED-CONTENT======
        ]
    }]
}"""
    auto_generate_content = "\n            ".join(
        [
            f"{{ text: '{book_name}', link: '/KindleNotes/{book_name}' }},"
            for book_name in notes_dict.keys()
        ]
    )
    config_ts += auto_generate_temp.replace(
        "======AUTO-GENERATED-CONTENT======", auto_generate_content
    )
    config_ts += "\n// AUTO-GENERATED-CONTENT:END"
    with open("docs/.vitepress/config.ts", "w", encoding="utf-8") as f:
        f.write(config_ts)


def parse_cmd_args(args):
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--push_github", default=False, action="store_true", help="push to github"
    )
    parser.add_argument(
        "--push_atlas", default=False, action="store_true", help="push to atlas"
    )
    parser.add_argument(
        "--push_favorate", default=False, action="store_true", help="push to favorate"
    )
    parser.add_argument(
        "--markdown_path", type=str, default="kindle_note", help="markdown path"
    )
    parser.add_argument(
        "--html_path", type=str, default="kindle_note/", help="html path"
    )
    parser.add_argument(
        "--atlas_uri",
        type=str,
        default=os.environ.get("MONGODB_ATLAS_URI"),
        help="mongodb atlas uri",
    )
    parser.add_argument("--set_vitepress", action="store_true", help="set vitepress")
    return parser.parse_args(args)


def main():
    args = parse_cmd_args(sys.argv[1:])
    notes = export_note(args.html_path)
    json_text = str(notes)
    print(json.dumps(notes, indent=4, ensure_ascii=False))
    if args.push_github:
        export_markdown(notes, args.markdown_path)
    if args.push_atlas:
        push_to_atlas(notes, args.atlas_uri)
    if args.push_favorate:
        push_favorate_to_atlas(notes, args.atlas_uri)
    if args.set_vitepress:
        set_vitepress(notes)


if __name__ == "__main__":
    main()
