"""
Database Reset Script
This script will recreate the database with the new schema.
Run this AFTER stopping the backend server.
"""

import os
import sys

# Add the Backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import engine, Base
import models

def reset_database():
    db_path = "house_app.db"
    
    # Check if database exists
    if os.path.exists(db_path):
        try:
            os.remove(db_path)
            print(f"✅ Deleted old database: {db_path}")
        except PermissionError:
            print("❌ Error: Database file is locked!")
            print("   Please stop the backend server first (Ctrl+C)")
            print("   Then run this script again.")
            return False
    else:
        print(f"ℹ️  Database file not found: {db_path}")
    
    # Create new database with updated schema
    print("Creating new database with updated schema...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database created successfully!")
    print("\nNew schema includes:")
    print("  - users table (id, email, password)")
    print("  - favorites table (id, user_id, property_id, location, price, ...)")
    print("  - Unique constraint on (user_id, property_id)")
    print("\nYou can now start the backend server: python main.py")
    return True

if __name__ == "__main__":
    print("=" * 60)
    print("Database Reset Script")
    print("=" * 60)
    print()
    
    success = reset_database()
    
    if success:
        print("\n" + "=" * 60)
        print("✅ Database reset complete!")
        print("=" * 60)
    else:
        print("\n" + "=" * 60)
        print("❌ Database reset failed!")
        print("=" * 60)
        sys.exit(1)
