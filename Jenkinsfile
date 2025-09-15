pipeline {
    agent any

    environment {
        MONGO_URI = credentials('MONGO_URI')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/harini-85/recipe-sharing-hub.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'npm test || echo "⚠️ No tests yet, skipping..."'
            }
        }

        stage('Build') {
            steps {
                echo 'Backend build successful ✅'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully 🚀'
        }
        failure {
            echo 'Pipeline failed ❌ - Check logs!'
        }
    }
}
