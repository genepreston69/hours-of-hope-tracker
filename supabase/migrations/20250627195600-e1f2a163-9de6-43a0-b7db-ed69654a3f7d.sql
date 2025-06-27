
-- Find all customers that do not have any service entries in 2025
SELECT 
    c.id,
    c.name,
    c.contact_person,
    c.contact_email,
    c.contact_phone
FROM customers c
WHERE c.id NOT IN (
    SELECT DISTINCT se.customer_id 
    FROM service_entries se 
    WHERE EXTRACT(YEAR FROM se.date) = 2025
)
ORDER BY c.name;
