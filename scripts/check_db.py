import sqlite3

conn = sqlite3.connect("local.db")
cursor = conn.cursor()

# Get column names for the 'indexes' table
cursor.execute("PRAGMA table_info(indexes)")
columns = cursor.fetchall()

print("--- Columns in 'indexes' table ---")
for col in columns:
    print(f"ID: {col[0]} | Name: {col[1]} | Type: {col[2]}")

conn.close()