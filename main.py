import requests
import json
import base64
import html
from bs4 import BeautifulSoup


def main():
    wordpress_user = 'admin'
    wordpress_password = 'Lh5q jpYj nKy3 PNOw AjXP U7mn'
    wordpress_credentials = wordpress_user + ':' + wordpress_password
    wordpress_token = base64.b64encode(wordpress_credentials.encode())
    wordpress_header = {'Authorization': 'Basic ' + wordpress_token.decode('utf-8')}
    response = requests.get("https://dev.htlweiz.at/wordpress/wp-json/wp/v2/posts/990",
                            headers=wordpress_header)
    content = json.loads(response.text)
    print(f'{html.unescape(content['title']['rendered'])}\n')
    soup = BeautifulSoup(content['content']['rendered'], 'html.parser')
    all_text = soup.get_text(separator=' ', strip=True)
    print(all_text)


if __name__ == "__main__":
    main()
