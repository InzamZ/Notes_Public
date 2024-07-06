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


if __name__ == "__main__":
    # 替换为你的文件路径
    file_path = "/Users/misaka/Desktop/Code/Notes_Public/apple_note/eml/"
    apple_note_html = "/Users/misaka/Desktop/Code/Notes_Public/apple_note"
    extract_html(file_path, apple_note_html)
    rst = export_apple_note(apple_note_html)
    print(json.dumps(rst, ensure_ascii=False))
