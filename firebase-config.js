// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBGJy-QhZVVGRDSyNCL3Q0dJ38BYIYGCE8",
    authDomain: "portfolio-reviews-61da7.firebaseapp.com",
    databaseURL: "https://portfolio-reviews-61da7-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "portfolio-reviews-61da7",
    storageBucket: "portfolio-reviews-61da7.firebasestorage.app",
    messagingSenderId: "223840413523",
    appId: "1:223840413523:web:ad07b66a10f982332f23a6",
    measurementId: "G-3MVPQ248VF"
};

// Initialize Firebase with error handling
let app, analytics, database;

try {
    // Import Firebase modules dynamically
    import('https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js')
        .then(({ initializeApp }) => {
            app = initializeApp(firebaseConfig);
            console.log('Firebase App initialized successfully');
            
            // Initialize Analytics
            return import('https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js');
        })
        .then(({ getAnalytics }) => {
            try {
                analytics = getAnalytics(app);
                console.log('Firebase Analytics initialized successfully');
            } catch (error) {
                console.warn('Analytics initialization failed:', error);
            }
            
            // Initialize Database
            return import('https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js');
        })
        .then(({ getDatabase, ref, onValue }) => {
            try {
                database = getDatabase(app);
                console.log('Firebase Database initialized successfully');
                
                // Make Firebase functions globally available
                window.FirebaseDB = {
                    database,
                    ref,
                    onValue,
                    isInitialized: true
                };
                
                // Trigger reviews loading if page is ready
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => {
                        if (window.loadTopReview) {
                            window.loadTopReview();
                        }
                    });
                } else {
                    if (window.loadTopReview) {
                        window.loadTopReview();
                    }
                }
                
            } catch (error) {
                console.error('Database initialization failed:', error);
                window.FirebaseDB = {
                    isInitialized: false,
                    error: error.message
                };
            }
        })
        .catch((error) => {
            console.error('Firebase initialization failed:', error);
            window.FirebaseDB = {
                isInitialized: false,
                error: error.message
            };
        });

} catch (error) {
    console.error('Firebase configuration error:', error);
    window.FirebaseDB = {
        isInitialized: false,
        error: error.message
    };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { firebaseConfig, FirebaseDB: window.FirebaseDB };
} 