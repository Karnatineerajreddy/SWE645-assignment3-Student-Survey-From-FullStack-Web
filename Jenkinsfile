pipeline {
    agent any

    environment {
        DOCKER_USER = 'neerajreddy22'
        BACKEND_IMAGE = "${DOCKER_USER}/swe645-backend"
        FRONTEND_IMAGE = "${DOCKER_USER}/swe645-frontend"
    }

    stages {

        stage('Clean') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/karnatineerajreddy/SWE645-assignment3-Student-Survey-From-FullStack-Web.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh """
                docker build -t $BACKEND_IMAGE:latest ./backend
                docker build -t $FRONTEND_IMAGE:latest ./frontend
                """
            }
        }

        stage('Push DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-login',
                                                 usernameVariable: 'USER',
                                                 passwordVariable: 'PASS')]) {
                    sh """
                    echo $PASS | docker login -u $USER --password-stdin
                    docker push $BACKEND_IMAGE:latest
                    docker push $FRONTEND_IMAGE:latest
                    """
                }
            }
        }

        stage('Deploy to K8s') {
            steps {
                withCredentials([file(credentialsId: 'rancher-kubeconfig', variable: 'KUBECONFIG_FILE')]) {
                    sh """
                    export KUBECONFIG=$KUBECONFIG_FILE

                    kubectl apply -f k8s/backend-deployment.yaml
                    kubectl apply -f k8s/backend-service.yaml
                    kubectl apply -f k8s/frontend-deployment.yaml
                    kubectl apply -f k8s/frontend-service.yaml

                    kubectl rollout restart deployment/survey-backend
                    kubectl rollout restart deployment/survey-frontend
                    """
                }
            }
        }
    }
}
