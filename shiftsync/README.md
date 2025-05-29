# ShiftSync – Cloud-Native Web Application

github repo URL : https://github.com/KeerthanaVijekumar/SIT737_s224719679

# Technologies Used

- **Node.js + Express.js** – Backend microservices
- **Docker** – Containerization of each service
- **Google Artifact Registry** – Image hosting (migrated from Docker Hub)
- **Kubernetes (GKE)** – Deployment and orchestration
- **MongoDB** – NoSQL backend, deployed inside the cluster
- **Google Cloud Monitoring & Logging** – Observability and alerting
- **kubectl CLI** – Cluster and deployment management
- **JWT** – Token-based stateless authentication
- **Manual Testing (`test.js`)** – Endpoint verification for each service


# Application Architecture 
The application is designed with microservice principles:

auth-service	 -  Authenticates users and issues JWT tokens
admin-service	 -  Allows admins to create, update, delete shift records
employee service - Employees can view and pick shifts (self-allocation)
frontend-service -	Serves HTML, JS, and CSS assets to users
mongo-service	 -  Stores shift and allocation data using MongoDB

# JWT Authentication Flow
On login, the auth-service checks credentials from a static user list (users.js)
A JWT token is generated with user role and ID, signed using a secret key
The token is stored in the browser’s `localStorage` and sent with requests via the `Authorization` header.
Backend services verify tokens using a Kubernetes-injected `JWT_SECRET`.
This makes the app stateless, scalable, and suitable for cloud-native environments.

# Secret Management
JWT secret is stored as a Kubernetes Secret
Injected into auth-service and employee-service via environment variables.

# Create GKE Cluster in GCP
can use command
gcloud container clusters create shiftsync-cluster ^
  --region australia-southeast1 ^
  --num-nodes 3 ^
  --enable-stackdriver-kubernetes


## Containerize Each Service
Each microservice has its own Dockerfile. Example for auth-service:

cd auth-service
docker build -t australia-southeast1-docker.pkg.dev/shiftsync-gcp/shiftsync-repo/auth-service:v2 .
docker push australia-southeast1-docker.pkg.dev/shiftsync-gcp/shiftsync-repo/frontend-service:v2

Repeat for:

admin-service
employee-service
frontend-service

## Image Hosting – Artifact registry
Note:  Initially Docker Hub was used due to permission issues with GCR and Artifact Registry on the student account. Later, the project was migrated to a personal GCP account and all images were hosted in Artifact Registry.

# Deploy to Kubernetes

# Auth service

kubectl apply -f kube/auth-deployment.yaml
kubectl apply -f kube/auth-service.yaml

Repeat for:

admin-service

employee-service

frontend-service

mongo-service

# Access the Application
# verify with
kubectl get pods
kubectl get svc

Access the app 
Frontend is accessible via the LoadBalancer IP

http://<frontend-external-ip>/login/login.html

# Testing
Each service includes a test.js script to validate core functionality:

/version endpoint

/login, /shifts, /allocate, /approve depending on service

Simulated requests with dummy payloads and mock tokens

Run tests with: npm test

# Monitoring & Alerts (GCP)
Custom dashboard created using Google Cloud Monitoring

Three active alert policies:

Pod Restart Alert – Alerts on container restarts

CPU Utilization Alert – Triggers if usage > 0.9

CPU Request Utilization (Mean) – Alerts based on sustained high usage