# Node.js DynamoDB Docker Application

A containerized Node.js application that connects to AWS DynamoDB, designed to run on EC2 instances. This project demonstrates how to deploy a Node.js application using Docker with DynamoDB integration.

## 🏗️ Architecture

```
┌─────────────┐         ┌─────────────┐
│   EC2       │         │  DynamoDB   │
│  Instance   │ ───────►│   Service   │
│             │         │             │
│  ┌────────┐ │         └─────────────┘
│  │ Docker │ │
│  │Node App│ │
│  └────────┘ │
└─────────────┘
```

## 📋 Prerequisites

- AWS Account with appropriate permissions
- EC2 instance (Amazon Linux 2 recommended)
- Docker installed on EC2
- AWS IAM Access Keys with DynamoDB permissions

## 🚀 Quick Start

### 1. Setup EC2 Instance

Connect to your EC2 instance and install Docker:

```bash
# Install Docker
sudo yum install -y docker

# Start Docker service
sudo service docker start

# Add user to docker group
sudo usermod -aG docker ec2-user

# Pull the application image
sudo docker pull philippaul/node-dynamodb-demo
```

### 2. Setup DynamoDB

Create a DynamoDB table with the following configuration:
- **Table Name**: `Contacts`
- **Primary Key**: `id` (String)
- **Region**: Choose your preferred AWS region

### 3. Configure IAM Access Keys

Create an IAM user with DynamoDB permissions and generate access keys:
- Access Key ID
- Secret Access Key

**Required IAM Policy:**
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:Scan",
                "dynamodb:Query"
            ],
            "Resource": "arn:aws:dynamodb:*:*:table/Contacts"
        }
    ]
}
```

### 4. Run the Application

```bash
docker run --rm -d -p 80:3000 --name node-dynamo-app \
  -e AWS_REGION=your-region \
  -e AWS_ACCESS_KEY_ID=your-access-key \
  -e AWS_SECRET_ACCESS_KEY=your-secret-key \
  philippaul/node-dynamodb-demo
```

### 5. Access the Application

Once the container is running, access your application at:
```
http://your-ec2-public-ip
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `AWS_REGION` | AWS region where DynamoDB table is located | Yes |
| `AWS_ACCESS_KEY_ID` | AWS access key ID | Yes |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key | Yes |
| `PORT` | Application port (default: 3000) | No |

### DynamoDB Table Schema

```json
{
  "TableName": "Contacts",
  "KeySchema": [
    {
      "AttributeName": "id",
      "KeyType": "HASH"
    }
  ],
  "AttributeDefinitions": [
    {
      "AttributeName": "id",
      "AttributeType": "S"
    }
  ]
}
```

## 🐳 Docker Commands

### Build from source (if you have the Dockerfile)
```bash
docker build -t node-dynamodb-app .
```

### Run with custom configuration
```bash
docker run --rm -d -p 80:3000 --name node-dynamo-app \
  -e AWS_REGION=us-east-1 \
  -e AWS_ACCESS_KEY_ID=your-access-key \
  -e AWS_SECRET_ACCESS_KEY=your-secret-key \
  -e PORT=3000 \
  philippaul/node-dynamodb-demo
```

### View logs
```bash
docker logs node-dynamo-app
```

### Stop container
```bash
docker stop node-dynamo-app
```

## 🔍 Troubleshooting

### Common Issues

1. **Connection to DynamoDB fails**
   - Verify AWS credentials are correct
   - Check IAM permissions for DynamoDB access
   - Ensure the region matches your DynamoDB table location

2. **Container won't start**
   - Check if port 80 is already in use: `sudo netstat -tlnp | grep :80`
   - Verify Docker is running: `sudo service docker status`

3. **Application not accessible**
   - Check EC2 security group allows inbound traffic on port 80
   - Verify container is running: `docker ps`

### Debug Mode

Run container with debug output:
```bash
docker run --rm -p 80:3000 --name node-dynamo-app \
  -e AWS_REGION=your-region \
  -e AWS_ACCESS_KEY_ID=your-access-key \
  -e AWS_SECRET_ACCESS_KEY=your-secret-key \
  -e DEBUG=* \
  philippaul/node-dynamodb-demo
```

## 📝 API Endpoints

Assuming this is a contacts management application, typical endpoints might include:

- `GET /` - Application homepage
- `GET /contacts` - List all contacts
- `POST /contacts` - Create new contact
- `GET /contacts/:id` - Get specific contact
- `PUT /contacts/:id` - Update contact
- `DELETE /contacts/:id` - Delete contact

## 🛡️ Security Best Practices

1. **Use IAM Roles instead of Access Keys** (recommended for EC2)
2. **Restrict IAM permissions** to minimum required
3. **Use AWS Secrets Manager** for sensitive data
4. **Enable VPC** for network isolation
5. **Keep Docker images updated**

## 🔗 Useful Links

- [AWS DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [Docker Documentation](https://docs.docker.com/)
- [AWS EC2 User Guide](https://docs.aws.amazon.com/ec2/)
- [Node.js AWS SDK](https://docs.aws.amazon.com/sdk-for-javascript/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section above
- Review AWS documentation for DynamoDB and EC2 setup

---

**Note**: Replace placeholder values (your-region, your-access-key, your-secret-key) with your actual AWS configuration values.
