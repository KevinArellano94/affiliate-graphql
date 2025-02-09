-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    contact_info JSONB NOT NULL DEFAULT '{}',
    tax_info JSONB NOT NULL DEFAULT '{}',
    banking_info JSONB NOT NULL DEFAULT '{}',
    two_factor_settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);

-- Affiliate links table
CREATE TABLE affiliate_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    url_slug VARCHAR(100) NOT NULL UNIQUE,
    target_url TEXT NOT NULL,
    platform VARCHAR(50) NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT valid_platform CHECK (platform IN ('youtube', 'x', 'instagram', 'tiktok', 'facebook', 'linkedin', 'other'))
);

-- Create indexes for affiliate_links
CREATE INDEX idx_affiliate_links_user ON affiliate_links(user_id);
CREATE INDEX idx_affiliate_links_platform ON affiliate_links(platform);
CREATE INDEX idx_affiliate_links_active ON affiliate_links(is_active);

-- Link clicks table (consider partitioning by date for large scale)
CREATE TABLE link_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    link_id UUID NOT NULL,
    ip_address VARCHAR(64) NOT NULL, -- Stored as hashed value
    user_agent JSONB NOT NULL DEFAULT '{}',
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    geo_data JSONB NOT NULL DEFAULT '{}',
    FOREIGN KEY (link_id) REFERENCES affiliate_links(id) ON DELETE RESTRICT
);

-- Create indexes for link_clicks
CREATE INDEX idx_link_clicks_link ON link_clicks(link_id);
CREATE INDEX idx_link_clicks_timestamp ON link_clicks(clicked_at);

-- Conversions table
CREATE TABLE conversions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    link_id UUID NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    transaction_data JSONB NOT NULL DEFAULT '{}',
    converted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (link_id) REFERENCES affiliate_links(id) ON DELETE RESTRICT,
    CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    CONSTRAINT positive_amount CHECK (amount > 0)
);

-- Create indexes for conversions
CREATE INDEX idx_conversions_link ON conversions(link_id);
CREATE INDEX idx_conversions_status ON conversions(status);

-- Account transactions table
CREATE TABLE account_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    conversion_id UUID,
    amount DECIMAL(12,2) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (conversion_id) REFERENCES conversions(id) ON DELETE RESTRICT,
    CONSTRAINT valid_transaction_type CHECK (transaction_type IN ('commission', 'withdrawal', 'refund', 'adjustment')),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'failed'))
);

-- Create indexes for account_transactions
CREATE INDEX idx_account_transactions_user ON account_transactions(user_id);
CREATE INDEX idx_account_transactions_conversion ON account_transactions(conversion_id);
CREATE INDEX idx_account_transactions_type ON account_transactions(transaction_type);

-- Withdrawals table
CREATE TABLE withdrawals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (transaction_id) REFERENCES account_transactions(id) ON DELETE RESTRICT,
    CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    CONSTRAINT positive_amount CHECK (amount > 0)
);

-- Create indexes for withdrawals
CREATE INDEX idx_withdrawals_transaction ON withdrawals(transaction_id);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at trigger to users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create materialized view for affiliate performance metrics
CREATE MATERIALIZED VIEW affiliate_performance AS
WITH conversion_stats AS (
    SELECT 
        link_id,
        COUNT(*) as total_conversions,
        COALESCE(SUM(amount), 0) as total_revenue
    FROM conversions 
    WHERE status = 'completed'
    GROUP BY link_id
)
SELECT 
    al.id as link_id,
    al.user_id,
    al.platform,
    COUNT(DISTINCT lc.id) as total_clicks,
    COALESCE(cs.total_conversions, 0) as total_conversions,
    COALESCE(cs.total_revenue, 0) as total_revenue,
    COALESCE(SUM(at.amount), 0) as total_commission
FROM affiliate_links al
LEFT JOIN link_clicks lc ON al.id = lc.link_id
LEFT JOIN conversion_stats cs ON al.id = cs.link_id
LEFT JOIN account_transactions at ON at.user_id = al.user_id 
    AND at.transaction_type = 'commission' 
    AND at.status = 'completed'
GROUP BY al.id, al.user_id, al.platform, cs.total_conversions, cs.total_revenue;

-- Create index on materialized view
CREATE UNIQUE INDEX idx_affiliate_performance_link ON affiliate_performance(link_id);

// create apollo graphql users table schema
admin can query/mutate all
user can query/mutate userId