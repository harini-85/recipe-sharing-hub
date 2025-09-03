pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/harini-85/recipe-sharing-hub.git'
            }
        }
        stage('Verify') {
            steps {
                echo 'Frontend code pulled successfully ✅'
            }
        }
    }
}
