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
                echo '📦 Checking out code from GitHub...'
                git branch: 'main', url: 'https://github.com/karnatineerajreddy/SWE645-assignment3-Student-Survey-From-FullStack-Web.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo '🐳 Building Docker images...'
                sh '''
                    # Build backend normally
                    docker build -t $BACKEND_IMAGE:latest ./backend

                    # FORCE frontend rebuild (fixes 127.0.0.1 caching issue)
                    docker build --no-cache -t $FRONTEND_IMAGE:latest ./frontend
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

                        echo "Deploying backend..."
                        kubectl apply -f k8s/backend-deployment.yaml -n default
                        kubectl apply -f k8s/backend-service.yaml -n default

                        echo "Deploying frontend..."
                        kubectl apply -f k8s/frontend-deployment.yaml -n default
                        kubectl apply -f k8s/frontend-service.yaml -n default

                        echo "Restarting deployments..."
                        kubectl rollout restart deployment/survey-backend -n default || true
                        kubectl rollout restart deployment/survey-frontend -n default || true

                        echo "✅ Deployment completed successfully!"
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
            echo '❌ SWE645 Pipeline failed. Check logs.'
        }
    }
}
