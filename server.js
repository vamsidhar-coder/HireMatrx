// ========== BACKEND API URL ==========
const API_URL = 'https://project-api-2gat.onrender.com/api';

// Test backend connection
async function testBackend() {
    try {
        const response = await fetch(`${API_URL}/test`);
        const data = await response.json();
        console.log('✅ Backend connected:', data);
        return true;
    } catch (error) {
        console.error('❌ Backend error:', error);
        return false;
    }
}

// Student Login
async function studentLogin() {
    const isConnected = await testBackend();
    if (!isConnected) {
        showNotification('Backend server not running!', 'error');
        return;
    }
    showNotification('Backend connected! Ready to login.', 'success');
}

// Make sure functions are available globally
window.studentLogin = studentLogin;

// Test on page load
document.addEventListener('DOMContentLoaded', () => {
    testBackend();
});
