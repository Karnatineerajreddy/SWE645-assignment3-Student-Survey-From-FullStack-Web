pipeline {
    agent any

    environment {
        // DockerHub username
        DOCKER_USER = 'neerajreddy22'
        BACKEND_IMAGE = "${DOCKER_USER}/swe645-backend"
        FRONTEND_IMAGE = "${DOCKER_USER}/swe645-frontend"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo '📦 Checking out code from GitHub (main branch)...'
                git branch: 'main', url: 'https://github.com/karnatineerajreddy/SWE645-assignment3-Student-Survey-From-FullStack-Web.git'
                // OR: use checkout scm (better if Jenkins job already pulls correct branch)
                // checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                echo '🐳 Building Docker images...'
                sh '''
                    sudo docker build -t $BACKEND_IMAGE:latest ./backend
                    sudo docker build -t $FRONTEND_IMAGE:latest ./frontend
                '''
            }
        }

        stage('Push to DockerHub') {
            steps {
                echo '⬆️  Pushing Docker images to DockerHub...'
                withCredentials([usernamePassword(credentialsId: 'dockerhub-login', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh '''
                        echo $PASS | docker login -u $USER --password-stdin
                        docker push $BACKEND_IMAGE:latest
                        docker push $FRONTEND_IMAGE:latest
                    '''
                }
            }
        }

        stage('Deploy to Rancher Kubernetes') {
            steps {
                echo '🚀 Deploying to Rancher-managed Kubernetes cluster...'
                withCredentials([file(credentialsId: 'rancher-kubeconfig', variable: 'KUBECONFIG_FILE')]) {
                    sh '''
                        export KUBECONFIG=$KUBECONFIG_FILE

                        echo "Creating namespace (if not exists)..."
                        kubectl apply -f kubernetes/namespace.yaml || true

                        echo "Deploying backend..."
                        kubectl apply -f kubernetes/backend-deployment.yaml -n student-survey

                        echo "Deploying frontend..."
                        kubectl apply -f kubernetes/frontend-deployment.yaml -n student-survey

                        echo "Restarting deployments..."
                        kubectl rollout restart deployment/backend -n student-survey
                        kubectl rollout restart deployment/frontend -n student-survey
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ SWE645 Deployment completed successfully!'
        }
        failure {
            echo '❌ SWE645 Pipeline failed. Please check logs.'
        }
    }
}
