from ast import parse
from curses import tigetflag
import json
from math import e
from re import search
import time
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
import pdb
import telebot
import email
import os
import re
import json
from bs4 import BeautifulSoup
from email.policy import default


def get_html_body_from_eml(eml_file_path):
    # 读取并解析.eml文件内容
    with open(eml_file_path, "r", encoding="utf-8") as f:
        raw_email = f.read()

    msg = email.message_from_string(raw_email, policy=default)
    html_body = "No HTML body found."
    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            content_disposition = str(part.get("Content-Disposition"))

            # 只关注非附件的text/html部分
            if content_type == "text/html" and "attachment" not in content_disposition:
                html_body = part.get_payload(decode=True).decode(
                    part.get_content_charset()
                )
    else:
        # 对于非multipart类型的邮件，直接检查是否为text/html
        if msg.get_content_type() == "text/html":
            html_body = msg.get_payload(decode=True).decode(msg.get_content_charset())

    # print(html_body)
    return html_body

    with open("apple_note.html", "w", encoding="utf-8") as f:
        f.write(html_body)


def extract_html(eml_path, html_path):
    # 读取路径eml_path下所有的eml文件调用get_html_body函数，返回HTML正文
    for file in os.listdir(eml_path):
        if file.endswith(".eml"):
            html_body = get_html_body_from_eml(os.path.join(eml_path, file))
            new_file = file.replace(".eml", ".html")
            with open(os.path.join(html_path, new_file), "w", encoding="utf-8") as f:
                f.write(html_body)


def export_apple_note(apple_html_path):
    json_data = {}
    for file in os.listdir(apple_html_path):
        if file.endswith(".html"):
            with open(os.path.join(apple_html_path, file), "r", encoding="utf-8") as f:
                html = f.read()
                notes, favorite_notes = parse_notes(html)
                # print(json.dumps(notes, ensure_ascii=False))
                # print(json.dumps(favorite_notes, ensure_ascii=False))
                bookname = file.replace(".html", "")
                json_data[bookname] = notes
    return json_data


def parse_notes(html):
    notes_list = []
    favorite_notes = []
    soup = BeautifulSoup(html, "html.parser")
    print(soup.prettify())
    book_name = soup.find("h1", class_="booktitle").text.strip()
    author = soup.find("h2").text.strip()
    notes = soup.find_all("div", class_="annotation")
    for x in notes:
        book_note = {}
        item = {
            "from": book_name,
            "author": author,
            "content": x.find("p", class_="annotationrepresentativetext").text.strip(),
            "chapter": x.find("div", class_="annotationchapter").text.strip(),
            "date": x.find("div", class_="annotationdate").text.strip(),
            "comments": x.find("p", class_="annotationnote").text.strip(),
            "color": "",
            "position": "",
            "page": "",
            "section": "",
            "chapter": "",
        }
        if x.find("div", class_="annotationselectionMarker defaultColor") is not None:
            item["type"] = 0
            item["color"] = "下划线"
        elif x.find("div", class_="annotationselectionMarker yellow") is not None:
            item["type"] = 1
            item["color"] = "黄色"
        elif x.find("div", class_="annotationselectionMarker green") is not None:
            item["type"] = 2
            item["color"] = "绿色"
        elif x.find("div", class_="annotationselectionMarker blue") is not None:
            item["type"] = 3
            item["color"] = "蓝色"
        elif x.find("div", class_="annotationselectionMarker pink") is not None:
            item["type"] = 4
            item["color"] = "粉色"
        elif x.find("div", class_="annotationselectionMarker purple") is not None:
            item["type"] = 5
            item["color"] = "紫色"
        if item["content"].strip() == "":
            continue
        item = parse_note_args(item)
        pattern = "^[^\u4e00-\u9fa5A-Za-z]+"
        res = re.match(pattern, item["chapter"])
        if res:
            item["chapter"] = item["chapter"][len(res.group(0)) :]
        if item["type"] == 0:
            favorite_notes.append(item)
        notes_list.append(item)
    return notes_list, favorite_notes


def parse_note_args(item):
    comment = item["comments"]
    comment = comment.splitlines()
    note_res = ""
    pattern = "\\[\\[[a-zA-Z_]+\\]\\]"
    for x in comment:
        res = re.match(pattern, x)
        if res:
            the_key = res.group(0)[2:-2]
            item[the_key] = x[len(res.group(0)) :]
            item[the_key] = item[the_key].strip()
        else:
            note_res += x
    item["note"] = note_res
    return item


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
        booknote_config = db.get_collection("BookNoteConfig")
        notes_list = notes_dict[book_name]
        collections = db.get_collection(notes_list[0]["from"])
        print(collections, flush=True)
        for x in notes_list:
            x["contenthash"] = md5(x["content"].encode("utf-8")).hexdigest()
            x["hash"] = "0"
            x["hash"] = md5(x["content"].encode("utf-8")).hexdigest()
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
            for book_name in sorted(notes_dict.keys())
        ]
    )
    config_ts += auto_generate_temp.replace(
        "======AUTO-GENERATED-CONTENT======", auto_generate_content
    )
    config_ts += "\n// AUTO-GENERATED-CONTENT:END"
    with open("docs/.vitepress/config.ts", "w", encoding="utf-8") as f:
        f.write(config_ts)


def parse_books_data(books_data: list, book_name: str):
    for book in books_data:
        if book["item"]["title"] == book_name:
            return book
    return None


def search_neodb(book_name: str, neodb_token: str):
    url = f"https://neodb.social/api/me/shelf/complete?category=book&page=1"
    headers = {
        "Authorization": "Bearer " + neodb_token,
        "accept": "application/json",
    }
    response = requests.get(url, headers=headers)
    resp_json = response.json()
    books_data = resp_json["data"]
    pages = resp_json["pages"]
    rst = parse_books_data(books_data, book_name)
    for page in range(1, pages + 1):
        if rst != None:
            return rst
        url = f"https://neodb.social/api/me/shelf/complete?category=book&page={page}"
        response = requests.get(url, headers=headers)
        resp_json = response.json()
        books_data = resp_json["data"]
        rst = parse_books_data(books_data, book_name)
    return rst


def get_ranking_star(rating: int):
    if rating == 0:
        return "🌑🌑🌑🌑🌑"
    elif rating == 1:
        return "🌗🌑🌑🌑🌑"
    elif rating == 2:
        return "🌕🌑🌑🌑🌑"
    elif rating == 3:
        return "🌕🌗🌑🌑🌑"
    elif rating == 4:
        return "🌕🌕🌑🌑🌑"
    elif rating == 5:
        return "🌕🌕🌗🌑🌑"
    elif rating == 6:
        return "🌕🌕🌕🌑🌑"
    elif rating == 7:
        return "🌕🌕🌕🌗🌑"
    elif rating == 8:
        return "🌕🌕🌕🌕🌑"
    elif rating == 9:
        return "🌕🌕🌕🌕🌗"
    elif rating == 10:
        return "🌕🌕🌕🌕🌕"


def push_channel(
    note: dict,
    atlas_uri: str,
    neodb_token: str,
    telegram_token: str,
    channel: str,
    force_update: bool = False,
):
    client = MongoClient(atlas_uri)
    db = client.get_database("BooksNotes")
    bot = telebot.TeleBot(telegram_token)
    for book_name in note.keys():
        booknote_config = db.get_collection("BookNoteConfig")
        book_config = booknote_config.find_one({"from": book_name})
        collections = db.get_collection(book_name)
        print(collections, flush=True)
        print(book_config, flush=True)
        if book_config == None:
            book_config = {"from": book_name, "info": None, "telegram_msg_info": None}
            booknote_config.insert_one(book_config)
        book_config = booknote_config.find_one({"from": book_name})
        book_info = book_config["info"]
        if book_info == None:
            book_info = search_neodb(book_name, neodb_token)
            print(book_info, flush=True)
        booknote_config.update_one(
            {"from": book_name}, {"$set": {"info": book_info}}, upsert=True
        )
        telegram_msg_info = book_config.get("telegram_msg_info", None)
        message = None
        if force_update or telegram_msg_info == None:
            try:
                # 强制清空所有之前的消息
                if (
                    telegram_msg_info != None
                    and "channel_message_id" in telegram_msg_info
                    and telegram_msg_info["channel_message_id"] != None
                ):
                    bot.delete_message(
                        chat_id=channel,
                        message_id=telegram_msg_info["channel_message_id"],
                    )
            except telebot.apihelper.ApiTelegramException as e:
                print("Delete message failed, maybe message not found.\nError:\n", e)

            try:
                # TODO：发送消息
                # pdb.set_trace()
                message = bot.send_message(
                    chat_id=channel,
                    text=f'📖 {book_info["item"]["title"]}\nRating: {get_ranking_star(book_info["rating_grade"])}\n👉 {book_info["item"]["id"]}\n',
                )
                telegram_msg_info = {
                    "channel_message_id": message.message_id,
                    "forward_chat": {},
                }
                print("Telegram message info: ", telegram_msg_info, flush=True)
                booknote_config.update_one(
                    {"from": book_name},
                    {"$set": {"telegram_msg_info": telegram_msg_info}},
                    upsert=True,
                )
            except Exception as e:
                print("Update mongodb failed, rollback send msg.\nError:\n", e)
                if message:
                    bot.delete_message(chat_id=channel, message_id=message.message_id)
    client.close()


def parse_cmd_args(args):
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--push_github", default=False, action="store_true", help="push to github"
    )
    parser.add_argument(
        "--push_atlas", default=False, action="store_true", help="push to atlas"
    )
    parser.add_argument(
        "--push_favorate",
        default=False,
        action="store_true",
        help="push favorate to atlas",
    )
    parser.add_argument(
        "--markdown_path", type=str, default="kindle_note", help="markdown path"
    )
    parser.add_argument(
        "--kindle_html_path", type=str, default="kindle_note/", help="kindle html path"
    )
    parser.add_argument(
        "--apple_html_path",
        type=str,
        default="apple_note/",
        help="apple books html path",
    )
    parser.add_argument(
        "--atlas_uri",
        type=str,
        default=os.environ.get("MONGODB_ATLAS_URI"),
        help="mongodb atlas uri, required if push to atlas, push to channel",
    )
    parser.add_argument("--set_vitepress", action="store_true", help="set vitepress")
    parser.add_argument(
        "--push_channel", default=False, action="store_true", help="push to channel"
    )
    parser.add_argument("--debug", default=False, action="store_true", help="debug")
    parser.add_argument(
        "--neodb_token",
        type=str,
        default=os.environ.get("NEODB_TOKEN"),
        help="neodb token",
    )
    parser.add_argument(
        "--telegram_token",
        type=str,
        default=os.environ.get("TELEGRAM_BOT_TOKEN"),
        help="telegram token",
    )
    parser.add_argument(
        "--report_channel",
        type=str,
        default=os.environ.get("REPORT_CHANNEL"),
        help="report channel",
    )
    parser.add_argument(
        "--force_update", default=False, action="store_true", help="force update"
    )
    parser.add_argument(
        "--push_apple_books_note",
        default=False,
        action="store_true",
        help="push apple books note",
    )
    parser.add_argument(
        "--apple_note_html", type=str, default="apple_note", help="apple note html"
    )
    parser.add_argument(
        "--parse_eml",
        default=False,
        action="store_true",
        help="parse eml to html",
    )
    parser.add_argument(
        "--eml_path", type=str, default="apple_note/eml", help="eml path"
    )
    return parser.parse_args(args)


def main():
    args = parse_cmd_args(sys.argv[1:])
    notes = export_note(args.kindle_html_path)
    apple_note = {}
    json_text = str(notes)
    print(json.dumps(notes, indent=4, ensure_ascii=False))
    if args.parse_eml:
        extract_html(args.eml_path, args.apple_html_path)
    if args.push_apple_books_note:
        apple_note = export_apple_note(args.apple_html_path)
    if args.push_github:
        export_markdown(notes, args.markdown_path)
        export_markdown(apple_note, args.markdown_path)
    if args.push_atlas:
        push_to_atlas(notes, args.atlas_uri)
        push_to_atlas(apple_note, args.atlas_uri)
    if args.push_favorate:
        push_favorate_to_atlas(notes, args.atlas_uri)
        push_favorate_to_atlas(apple_note, args.atlas_uri)
    if args.set_vitepress:
        set_vitepress(notes)
    if args.push_channel:
        push_channel(
            notes,
            args.atlas_uri,
            args.neodb_token,
            args.telegram_token,
            args.report_channel,
            args.force_update,
        )


if __name__ == "__main__":
    main()
