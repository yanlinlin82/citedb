# CITEdb: Cell-cell INTeraction DataBase

> **Source Code**: This repository contains the source code for the CITEdb database described in the research paper:
>
> **CITEdb: a manually curated database of cell-cell interactions in human**
> *Nayang Shan, Yao Lu, Hao Guo, Dongyu Li, Jitong Jiang, Linlin Yan, Jiudong Gao, Yong Ren, Xingming Zhao, Lin Hou*
> Bioinformatics, 2022 Nov 15;38(22):5144-5148.
> DOI: [10.1093/bioinformatics/btac654](https://doi.org/10.1093/bioinformatics/btac654)
> PMID: [36179089](https://pubmed.ncbi.nlm.nih.gov/36179089/)

## 🚀 Quick Start

### 1. Installation

```bash
# Install and configure services (default ports: API=3000, Frontend=8080)
./scripts/install.sh

# Custom port installation
./scripts/install.sh 3000 8080
```

### 2. Start Services

```bash
# Start systemd service
sudo ./scripts/manage.sh start

# Or run directly (development mode)
./scripts/start.sh
```

### 3. Service Management

```bash
# Check status
./scripts/manage.sh status

# Stop service
./scripts/manage.sh stop

# Restart service
./scripts/manage.sh restart

# View logs
./scripts/manage.sh logs
```

### 4. Auto Update

```bash
# Check and update to latest version
./scripts/update.sh

# Quiet mode (no output when no updates, suitable for crontab)
./scripts/update.sh -q
```

#### Setup Scheduled Updates

```bash
# Edit crontab
crontab -e

# Add the following line (check for updates every hour)
0 * * * * cd /path/to/citedb && ./scripts/update.sh -q

# Or update daily at 2 AM
0 2 * * * cd /path/to/citedb && ./scripts/update.sh -q
```

## 📋 System Requirements

- **Operating System**: Ubuntu 18.04+ or other Linux distributions
- **Node.js**: Version 16.0.0 or higher
- **Apache2**: Web server
- **Memory**: At least 2GB RAM recommended

## 🔧 Environment Setup

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Apache2
sudo apt install apache2 -y
```

## 🌐 Access URLs

After installation, access via:

- **Frontend Interface**: http://localhost
- **Backend API**: http://localhost/api

## 📁 Project Structure

```
citedb/
├── celltypeapi/          # Backend API service
├── celltypeweb/          # Frontend Vue application
├── scripts/              # Management scripts
│   ├── install.sh        # Installation script
│   ├── start.sh          # Startup script
│   ├── manage.sh         # Service management
│   ├── update.sh         # Auto update
│   └── test.sh           # Test script
├── config/               # Configuration files (not in git)
├── LICENSE               # MIT License
└── README.md
```

## ⚙️ Configuration

### Port Configuration

Installation generates `config/local.js` configuration file with port settings:

```javascript
module.exports = {
    api: {
        port: 3000
    },
    frontend: {
        port: 8080
    }
}
```

### Service Configuration

- **systemd service**: `/etc/systemd/system/citedb.service`
- **Apache config**: `/etc/apache2/sites-available/citedb.conf`
- **Project path**: Current project directory

## 🔍 Troubleshooting

### Common Issues

1. **Port Occupied**

   ```bash
   sudo netstat -tlnp | grep :3000
   sudo kill -9 <PID>
   ```

2. **Permission Issues**

   ```bash
   sudo chown -R www-data:www-data /path/to/citedb
   ```

3. **Service Startup Failure**

   ```bash
   ./scripts/manage.sh status
   ./scripts/manage.sh logs
   ```

4. **Update Failure**

   ```bash
   # Check git status
   git status

   # Manual update
   git pull origin main
   ./scripts/update.sh
   ```

### Log Locations

- **Service logs**: `journalctl -u citedb -f`
- **Apache logs**: `/var/log/apache2/citedb_*.log`

## 🔒 Security Recommendations

1. **Firewall Configuration**

   ```bash
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS
   ```

2. **SSL Certificate**

   ```bash
   sudo apt install certbot python3-certbot-apache
   sudo certbot --apache -d your-domain.com
   ```

3. **Regular Backup**

   ```bash
   # Backup database
   cp celltypeapi/database/citedb.db backup/

   # Backup configuration
   cp config/local.js backup/
   ```

## 📝 Development Guide

### Manual Startup (Development Mode)

```bash
# Backend
cd celltypeapi
npm install
node simple-index.js

# Frontend
cd celltypeweb
npm install --legacy-peer-deps
npm run serve
```

### Database Initialization

```bash
cd celltypeapi
node setup-db.js
```

### Update Process

1. **Auto Update**: `./scripts/update.sh`
2. **Manual Update**:

   ```bash
   git pull origin main
   cd celltypeapi && npm install
   cd ../celltypeweb && npm install --legacy-peer-deps && npm run build
   sudo systemctl restart citedb
   ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📚 Citation

If you use this software in your research, please cite the original paper:

```bibtex
@article{shan2022citedb,
  title={CITEdb: a manually curated database of cell-cell interactions in human},
  author={Shan, Nayang and Lu, Yao and Guo, Hao and Li, Dongyu and Jiang, Jitong and Yan, Linlin and Gao, Jiudong and Ren, Yong and Zhao, Xingming and Hou, Lin},
  journal={Bioinformatics},
  volume={38},
  number={22},
  pages={5144--5148},
  year={2022},
  publisher={Oxford University Press},
  doi={10.1093/bioinformatics/btac654}
}
```
