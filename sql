SQL
CREATE TABLE Stocks (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(50),
    index_name VARCHAR(50),
    sector VARCHAR(50),
    price NUMERIC(10, 2),
    change_percentage NUMERIC(10, 2)
);

CREATE TABLE Indexes (
    id SERIAL PRIMARY KEY,
    index_name VARCHAR(50),
    price NUMERIC(10, 2),
    change_percentage NUMERIC(10, 2)
);
