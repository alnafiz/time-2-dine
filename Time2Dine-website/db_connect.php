<?php
// Database connection configuration for Time2Dine website
// Database: time2dine
// Password: 1234

// Database connection parameters
$host = 'localhost';
$dbname = 'time2dine';
$username = 'root';  // Default XAMPP MySQL username
$password = '1234';

try {
    // Create PDO connection
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    
    // Set PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Connection successful - display message
    echo "<div style='background-color: #d4edda; color: #155724; padding: 15px; margin: 20px; border: 1px solid #c3e6cb; border-radius: 5px; font-family: Arial, sans-serif;'>";
    echo "<h3 style='margin: 0 0 10px 0;'>✅ Connection Successful!</h3>";
    echo "<p style='margin: 0;'>Database 'time2dine' connected successfully to XAMPP MySQL server.</p>";
    echo "<p style='margin: 5px 0 0 0; font-size: 12px; color: #666;'>Host: $host | Database: $dbname | Username: $username</p>";
    echo "</div>";
    
    // Optional: You can remove the echo statements above if you don't want to display the message
    // and just use the $pdo variable for database operations
    
} catch(PDOException $e) {
    // Connection failed - display error message
    echo "<div style='background-color: #f8d7da; color: #721c24; padding: 15px; margin: 20px; border: 1px solid #f5c6cb; border-radius: 5px; font-family: Arial, sans-serif;'>";
    echo "<h3 style='margin: 0 0 10px 0;'>❌ Connection Failed!</h3>";
    echo "<p style='margin: 0;'>Error: " . $e->getMessage() . "</p>";
    echo "<p style='margin: 5px 0 0 0; font-size: 12px; color: #666;'>Please check your XAMPP MySQL service and database credentials.</p>";
    echo "</div>";
    
    // Exit script on connection failure
    die();
}

// Function to get database connection (for use in other files)
function getDBConnection() {
    global $pdo;
    return $pdo;
}

// Function to test connection (can be called from other files)
function testConnection() {
    try {
        $pdo = getDBConnection();
        return true;
    } catch(Exception $e) {
        return false;
    }
}

// Optional: Close connection when done (usually not needed for web applications)
// $pdo = null;
?>
