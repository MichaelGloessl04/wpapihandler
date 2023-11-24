import requests
import base64


def main():
    payload = {
        'id': 123,
        'title': 'Your Event Title',
        'start_date': '2023-11-24T10:00:00',
        'end_date': '2023-11-24T12:00:00'
    }
    wordpress_user = 'vue_js'
    wordpress_password = 'rXhW lh6q wuuv d3C5 IKrX YMkI'
    wordpress_credentials = wordpress_user + ':' + wordpress_password
    wordpress_token = base64.b64encode(wordpress_credentials.encode())
    wordpress_header = {'Authorization': 'Basic ' + wordpress_token.decode('utf-8')}

    response = requests.post("https://dev.htlweiz.at/wordpress/wp-json/tribe/events/v1/events/",
                             headers=wordpress_header, json=payload)
    print(response.content)

if __name__ == "__main__":
    main()
