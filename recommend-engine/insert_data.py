import csv
import json
import mysql.connector
import random
from datetime import datetime
from src.config import Config


def insert_categories():
    """Insert categories data from CSV file into MySQL database"""

    # Connect to MySQL
    conn = mysql.connector.connect(
        host=Config.MYSQL_HOST,
        port=Config.MYSQL_PORT,
        user=Config.MYSQL_USER,
        password=Config.MYSQL_PASSWORD,
        database=Config.MYSQL_DB,
    )

    cursor = conn.cursor()

    try:
        # Read CSV file
        csv_file_path = "data/categories.csv"

        with open(csv_file_path, "r", encoding="utf-8") as file:
            csv_reader = csv.DictReader(file)

            # Prepare insert query
            insert_query = """
                INSERT INTO categories (id, name, parent_id)
                VALUES (%s, %s, %s)
                ON DUPLICATE KEY UPDATE
                    name = VALUES(name),
                    parent_id = VALUES(parent_id)
            """

            inserted_count = 0
            updated_count = 0

            for row in csv_reader:
                # Handle NULL values for parent_id
                parent_id = (
                    None
                    if row["parent_id"] == "NULL" or row["parent_id"] == ""
                    else int(row["parent_id"])
                )

                # Execute insert
                cursor.execute(insert_query, (int(row["id"]), row["name"], parent_id))

                if cursor.rowcount == 1:
                    inserted_count += 1
                elif cursor.rowcount == 2:
                    updated_count += 1

            # Commit the transaction
            conn.commit()

            print(f"✓ Successfully inserted {inserted_count} categories")
            print(f"✓ Updated {updated_count} existing categories")
            print(f"✓ Total processed: {inserted_count + updated_count}")

    except FileNotFoundError:
        print(f"Error: Could not find file '{csv_file_path}'")
    except mysql.connector.Error as err:
        print(f"MySQL Error: {err}")
        conn.rollback()
    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()


def insert_products():
    """Insert products and product_images data from JSON file into MySQL database"""

    # Connect to MySQL
    conn = mysql.connector.connect(
        host=Config.MYSQL_HOST,
        port=Config.MYSQL_PORT,
        user=Config.MYSQL_USER,
        password=Config.MYSQL_PASSWORD,
        database=Config.MYSQL_DB,
    )

    cursor = conn.cursor()

    try:
        # Read JSON file
        json_file_path = "data/books_updated.json"

        with open(json_file_path, "r", encoding="utf-8") as file:
            books = json.load(file)

        # Prepare insert queries
        product_insert_query = """
            INSERT INTO products (
                id, name, isbn, publisher, publisher_date, number_of_pages,
                description, price, dimension, 
                stock_quantity, category_id, discount, rating_avg, rating_count,
                created_at, updated_at
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                name = VALUES(name),
                isbn = VALUES(isbn),
                publisher = VALUES(publisher),
                publisher_date = VALUES(publisher_date),
                number_of_pages = VALUES(number_of_pages),
                description = VALUES(description),
                price = VALUES(price),
                dimension = VALUES(dimension),
                stock_quantity = VALUES(stock_quantity),
                updated_at = VALUES(updated_at)
        """

        image_insert_query = """
            INSERT INTO product_images (product_id, image_url, public_id)
            VALUES (%s, %s, %s)
            ON DUPLICATE KEY UPDATE
                image_url = VALUES(image_url),
                public_id = VALUES(public_id)
        """

        products_inserted = 0
        products_updated = 0
        images_inserted = 0
        skipped_count = 0

        # First pass: Insert products
        print("Importing products...")
        for book in books:
            try:
                # Skip books with empty id
                if not book.get("id"):
                    skipped_count += 1
                    continue

                product_id = int(book["id"])

                # Parse and format data
                title = book.get("title")
                title = title.strip() if title else None
                isbn = book.get("isbn")
                isbn = isbn.strip() if isbn else None
                publisher = book.get("publisher")
                publisher = publisher.strip() if publisher else None
                publication_date_str = book.get("publication_date")
                publication_date_str = (
                    publication_date_str.strip() if publication_date_str else ""
                )
                pages = book.get("pages")
                description = book.get("description")
                description = description.strip() if description else None
                price_value = book.get("price")
                size = book.get("size")
                size = size.strip() if size else None

                # Convert publication_date to datetime
                publisher_date = None
                if publication_date_str:
                    try:
                        publisher_date = datetime.strptime(
                            publication_date_str, "%Y-%m-%d"
                        )
                    except ValueError:
                        pass

                # If no valid publication date, set to current datetime
                if publisher_date is None:
                    publisher_date = datetime.now()

                # Convert pages to int
                number_of_pages = None
                if pages:
                    try:
                        number_of_pages = int(pages)
                    except (ValueError, TypeError):
                        pass

                # Convert price to bigint (VND in smallest unit)
                price = None
                if price_value:
                    try:
                        price = int(float(price_value) * 1000)
                    except (ValueError, TypeError):
                        pass

                # Generate short description (first 500 chars)
                short_description = None
                if description:
                    short_description = description[:500]

                # Generate random stock quantity between 10 and 500
                stock_quantity = random.randint(10, 500)

                # Set default values
                discount = 0
                rating_avg = 0.0
                rating_count = 0

                # Get category_id from book data, default to 1 if not present
                category_id = book.get("category_id")
                if category_id:
                    try:
                        category_id = int(category_id)
                    except (ValueError, TypeError):
                        category_id = 1
                else:
                    category_id = 1

                # Current timestamp
                now = datetime.now()

                # Insert product
                cursor.execute(
                    product_insert_query,
                    (
                        product_id,
                        title,
                        isbn,
                        publisher,
                        publisher_date,
                        number_of_pages,
                        description,
                        price,
                        size,
                        stock_quantity,
                        category_id,
                        discount,
                        rating_avg,
                        rating_count,
                        now,
                        now,
                    ),
                )

                if cursor.rowcount == 1:
                    products_inserted += 1
                elif cursor.rowcount == 2:
                    products_updated += 1

            except (ValueError, KeyError) as e:
                print(f"Warning: Skipping book {book.get('id', 'unknown')}: {e}")
                skipped_count += 1
                continue

        # Commit products
        conn.commit()
        print(
            f"✓ Products committed: {products_inserted} inserted, {products_updated} updated"
        )

        # Second pass: Insert product images
        print("Importing product images...")
        for book in books:
            try:
                # Skip books with empty id
                if not book.get("id"):
                    continue

                product_id = int(book["id"])
                image_url = book.get("image_url")
                image_url = image_url.strip() if image_url else None
                isbn = book.get("isbn")
                isbn = isbn.strip() if isbn else None

                # Insert product image if URL exists
                if image_url:
                    # Generate public_id from ISBN
                    public_id = f"book_{isbn}" if isbn else None
                    cursor.execute(
                        image_insert_query, (product_id, image_url, public_id)
                    )
                    if cursor.rowcount > 0:
                        images_inserted += 1

            except (ValueError, KeyError) as e:
                continue

        # Commit images
        conn.commit()
        print(f"✓ Product images committed: {images_inserted} inserted")

        print("\n" + "=" * 40)

        print(f"✓ Successfully inserted {products_inserted} products")
        print(f"✓ Updated {products_updated} existing products")
        print(f"✓ Inserted {images_inserted} product images")
        print(f"⊘ Skipped {skipped_count} invalid rows")
        print(f"✓ Total processed: {products_inserted + products_updated}")

    except FileNotFoundError:
        print(f"Error: Could not find file '{json_file_path}'")
    except mysql.connector.Error as err:
        print(f"MySQL Error: {err}")
        conn.rollback()
    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "products":
        print("Starting products import...")
        insert_products()
        print("Products import completed!")
    else:
        print("Starting categories import...")
        insert_categories()
        print("Categories import completed!")

        print("\nTo import products, run: python insert_data.py products")

    # print("Starting products import...")
    # insert_products()
    # print("Products import completed!")
