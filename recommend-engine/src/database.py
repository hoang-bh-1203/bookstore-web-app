import mysql.connector
from .config import Config


def get_mysql_connection():
    return mysql.connector.connect(
        host=Config.MYSQL_HOST,
        port=Config.MYSQL_PORT,
        user=Config.MYSQL_USER,
        password=Config.MYSQL_PASSWORD,
        database=Config.MYSQL_DB,
    )


def fetch_all_books_batch(batch_size=100):
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM books")
        while True:
            rows = cursor.fetchmany(batch_size)
            if not rows:
                break
            yield rows
    finally:
        cursor.close()
        conn.close()
