pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKERHUB_USER = 'diaadja'
        IMAGE_TAG = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Recuperation du code depuis GitHub (branche: ${env.BRANCH_NAME})"
                checkout scm
            }
        }

        stage('Build Backend Image') {
            steps {
                echo "Construction de l'image backend..."
                sh "docker build -t ${DOCKERHUB_USER}/smarttask-backend:${IMAGE_TAG} ./backend"
            }
        }

        stage('Build Frontend Image') {
            steps {
                echo "Construction de l'image frontend..."
                sh "docker build -t ${DOCKERHUB_USER}/smarttask-frontend:${IMAGE_TAG} ./frontend"
            }
        }

        stage('Login Docker Hub') {
            steps {
                echo "Connexion au registre Docker Hub..."
                sh "echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin"
            }
        }

        stage('Push Images') {
            steps {
                echo "Publication des images sur Docker Hub..."
                sh "docker push ${DOCKERHUB_USER}/smarttask-backend:${IMAGE_TAG}"
                sh "docker push ${DOCKERHUB_USER}/smarttask-frontend:${IMAGE_TAG}"
            }
        }
    }

    post {
        success {
            echo "Pipeline execute avec succes : images construites et publiees."
        }
        failure {
            echo "Le pipeline a echoue. Consultez les journaux ci-dessus pour le detail de l'erreur."
        }
        always {
            sh 'docker logout || true'
        }
    }
}
