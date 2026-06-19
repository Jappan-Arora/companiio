import mysql from "mysql2/promise";
import "dotenv/config";

const url = process.env.DATABASE_URL!;

async function run() {
  const conn = await mysql.createConnection(url);

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS password_credentials (
      id SERIAL PRIMARY KEY,
      userId BIGINT UNSIGNED NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log("password_credentials table ready");

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS deal_claims (
      id SERIAL PRIMARY KEY,
      dealId BIGINT UNSIGNED NOT NULL,
      userId BIGINT UNSIGNED NOT NULL,
      venueId BIGINT UNSIGNED NOT NULL,
      qr_code VARCHAR(255) NOT NULL UNIQUE,
      status ENUM('claimed','redeemed','expired','cancelled') NOT NULL DEFAULT 'claimed',
      redeemedAt TIMESTAMP NULL,
      expiresAt TIMESTAMP NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `);
  console.log("deal_claims table ready");

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS booking_requests (
      id SERIAL PRIMARY KEY,
      venueId BIGINT UNSIGNED NOT NULL,
      user_name VARCHAR(255) NOT NULL,
      user_email VARCHAR(320) NOT NULL,
      user_phone VARCHAR(50),
      date VARCHAR(20) NOT NULL,
      time VARCHAR(10) NOT NULL,
      party_size INT NOT NULL,
      occasion VARCHAR(100),
      special_requests TEXT,
      status ENUM('pending','confirmed','declined') NOT NULL DEFAULT 'pending',
      email_sent BOOLEAN DEFAULT false,
      venue_response TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log("booking_requests table ready");

  await conn.end();
  console.log("All tables created successfully!");
}

run().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
