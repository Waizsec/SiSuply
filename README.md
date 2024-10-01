# SiSuply
## Anggota | Kelompok 3
- Raden Bagus Rifa’i Kacanegara    | 162112133047
- Moreno Achmad Musadat            | 162112133080
- Davano Al Raffi Abdul Jabbar     | 162112133083
- I Ketut Andika Wisnu Danuarta    | 162112133115
- Alun Yuanita Indraswari          | 164221001
- Zoen Yokhanan Sianipar           | 164221038


## Getting Started

Berikut ini contoh bagaimana  instruksi untuk menyiapkan proyek ini secara lokal.
Untuk menyiapkan dan menjalankannya, ikuti contoh langkah sederhana berikut ini.

### Prerequisites

* npm
  ```sh
  npm install 
  ```
* pip
  ```sh
  pip install flask firebase_admin 
  ```

### Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Get a free API Key at [https://example.com](https://example.com)
2. Clone the repo
   ```sh
   git clone https://github.com/github_username/repo_name.git
   ```
3. Install npm
  ```sh
  npm install 
  ```
4. Install python libraries
  ```sh
  pip install flask firebase_admin 
  ```
5. Enter your Firebase API in `cfg/firebaseconfig.json`
   ```json
   'YOUR_API_KEY'
   ```

# API untuk Manajemen Produk dan Cek Harga Pengiriman

Proyek ini adalah aplikasi API berbasis Flask yang menyediakan fitur untuk mengelola produk, memproses cek harga dari distributor, melakukan pemesanan, dan memperbarui stok berdasarkan status pengiriman. API ini terhubung dengan Firebase Firestore untuk menyimpan data transaksi dan produk.

## Fitur API

### 1. Menampilkan Daftar Supplier (GET /api/suppliers)
Mengambil data supplier dari server, termasuk informasi nama supplier, kota, tipe, pemilik, dan deskripsi supplier.
#### Contoh Input :
```sh
  http://127.0.0.1:5000/api/suppliers
```
#### Contoh Output :
```sh
{    "deskripsi": "Toko Sparepart 03 kami, yang telah berdiri sejak tahun 2024, berkomitmen untuk menyediakan sparepart sepeda berkualitas tinggi bagi para pecinta sepeda. Kami menawarkan berbagai macam komponen sepeda, mulai dari rem yang presisi, rantai tahan lama, grip yang nyaman, pedal yang kokoh, saddle ergonomis, hingga bar tape dengan daya cengkeram yang optimal. Setiap produk yang kami jual dipilih dengan cermat untuk memastikan performa terbaik, kenyamanan, dan keamanan bersepeda. Dengan pengalaman dan dedikasi dalam industri, kami selalu berusaha memberikan pelayanan terbaik kepada pelanggan kami.",
    "id": "SUP03",
    "kota": "Surakarta",
    "nama_sup": "Supplier 03",
    "pemilik": "Kelompok 03",
    "tipe": "Sparepart"}
```

### 2. Cek Harga dari Distributor (POST /api/cek_harga)
- Menerima data dalam format JSON yang berisi informasi tentang:
  - Tujuan pengiriman
  - Berat total barang
  - Detail keranjang belanja
- Mengirim permintaan cek harga ke distributor tertentu berdasarkan ID distributor yang dikirimkan.
- Menyimpan transaksi ke Firestore dengan `id_log` yang di-generate berdasarkan urutan transaksi sebelumnya.
#### Contoh Input :
```ssh
{   "id_retail": "RET01",  
    "id_distributor": "DIS03",  
    "kota_tujuan": "Jakarta",  
    "total_berat_barang": 1200,  
    "total_harga_barang": 500000,  
    "cart": [  
        {  
            "id_produk": "P03-1",  
            "quantity": 10  
        },  
        {  
            "id_produk": "P03-5",  
            "quantity": 5  
        }  ]  }
```
### Contoh Output :
```ssh
{
    "harga_pengiriman": 960000,
    "lama_pengiriman": "6 hari",
    "pesan": "Cek harga berhasil",
    "id_log": "SUP03-3"
}
```

### 3. Checkout/Pemesanan Produk (POST /api/checkout)
- Memproses pemesanan dengan mengirimkan `id_log` ke distributor yang sesuai.
- Menyimpan hasil checkout ke Firestore dengan nomor resi dan informasi pengiriman.
#### Contoh Input :
```ssh
{"id_log": "SUP03-6"}
```
#### Contoh Output :
```ssh
{
    "harga_pengiriman": 159,
    "lama_pengiriman": "10 hari",
    "message": "Pemesanan berhasil dilakukan",
    "no_resi": "1PK9ADFR3C",
    "purchase
```

## Fitur CRUD

### 4. Menambah Produk (POST /api/products)
- Menambah produk baru ke dalam koleksi `tbl_produk` di Firestore dengan ID produk yang otomatis di-generate berdasarkan jumlah produk yang ada.
#### Contoh Input :
Melalui pengisian form yang tersedia

#### Contoh Output :
```ssh
{"id_produk": "33",
    "success": true}
```


### 5. Mengambil Daftar Produk (GET /api/products)
- Mengambil semua produk dari Firestore dan mengembalikannya dalam format JSON.
#### Contoh Input :
```ssh
http://127.0.0.1:5000/api/products
```

#### Contoh Output :
```ssh
[    {        "berat": 0.309,
        "deskripsi": "United Rantai 9 Speed RT-271 adalah rantai sepeda yang terbuat dari baja (steel berkualitas tinggi, yang dirancang khusus untuk sepeda dengan sistem transmisi 9 percepatan (9 speed). Dengan panjang link 116L, rantai ini kompatibel untuk digunakan pada sepeda dengan jumlah sprocket hingga 9 speed, sehingga dapat memberikan perpindahan gigi yang halus dan responsif. Kekuatan material baja yang digunakan membuat rantai ini tahan lama dan mampu menghadapi berbagai kondisi bersepeda.",
        "harga": 150000,
        "id": 1,
        "id_produk": "1",
        "jml_stok": 20,
        "link_gambar": "https://icubic-space.sgp1.digitaloceanspaces.com/app/public/ss/lib/pro/img/2024/08/united-rantai-9-speed-rt-271-1-1724837137.jpg",
        "nama_produk": "United Rantai 9 Speed RT-271"},...]
```

### 6. Memperbarui Produk (PUT /api/products/<product_id>)
- Memperbarui data produk berdasarkan ID produk yang diberikan. Pengguna dapat memperbarui atribut seperti berat, deskripsi, harga, stok, nama produk, dan link gambar.
#### Contoh Input :
```ssh
http://127.0.0.1:5000/api/products/<product_id>
{ "berat": "0.55"}
```
#### Contoh Output :
```ssh
"TRUE"
```

### 7. Menghapus Produk (DELETE /api/products/<product_id>)
- Menghapus produk dari Firestore berdasarkan ID produk.
#### Contoh Input :
```ssh
http://127.0.0.1:5000/api/products/31
```

#### Contoh Output :
```ssh
"TRUE"
```

### 8. Memperbarui informasi produk yang sudah ada berdasarkan Status Pengiriman (GET /api/get_transaksi)
- Memeriksa status pengiriman barang dari distributor berdasarkan nomor resi. Jika pengiriman sudah selesai, stok produk yang terjual akan dikurangi secara otomatis di Firestore. 

#### Contoh Output :
```ssh
[    {        "id_log": "SUP03-1",
        "no_resi": "54Q8N41TE2",
        "produk": [            {
                "harga": 150000,
                "id_produk": "P03-1",
                "nama_produk": "United Rantai 9 Speed RT-271",
                "quantity": 2,
                "total": 300000}        ],
        "subtotal": 300000,
        "tanggal_pembelian": "Mon, 30 Sep 2024 17:57:06 GMT"}
```

## Struktur Proyek
- **app.py**: File utama yang berisi semua endpoint API, koneksi Firebase Firestore, serta logika untuk mengelola produk dan transaksi.
- **cfg/configfirebase.json**: File konfigurasi Firebase yang digunakan untuk menghubungkan aplikasi dengan Firestore.

## Prasyarat
- **Python 3.x**: Aplikasi ini dikembangkan menggunakan Python, jadi pastikan Anda telah menginstal Python versi terbaru.
- **Flask**: Framework web minimalis untuk menjalankan server API.
- **Firebase Admin SDK**: Library yang memungkinkan aplikasi terhubung ke Firebase Firestore.
- **Requests**: Library Python untuk mengirim HTTP requests ke server eksternal.

Instalasi dependencies dapat dilakukan dengan perintah berikut:

```bash
pip install Flask firebase-admin requests

```
## Konfigurasi

1. **Buat Akun Firebase**: 
   - Unduh file konfigurasi `configfirebase.json` yang berisi kredensial Firebase.
  
2. **Simpan File Konfigurasi**:
   - Simpan file tersebut di dalam folder `cfg/` dan sesuaikan jalur file di dalam `app.py` seperti berikut:

   ```python
   file_cred = credentials.Certificate("cfg/configfirebase.json")
   ```
## Cara Menjalankan

Jalankan aplikasi dengan perintah berikut:

```bash
python app.py
```

## Penggunan

Berikut adalah contoh penggunaan API menggunakan curl atau aplikasi Postman:

1. **Menambah Produk**:
2. **Cek Harga dari Distributor**:
   Request:
   ```bash
   curl -X POST http://127.0.0.1:5000/api/cek_harga -H "Content-Type: application/json" -d '{
      "id_retail": "RET01",
      "id_distributor": "DIS03",
      "kota_tujuan": "Yogyakarta",
      "total_berat_barang": 5,
      "total_harga_barang": 250000,
      "cart": [{"id_produk": "001", "quantity": 2}]
    }'
   ```
   Response:
   ```bash
   {
        "pesan": "Cek harga berhasil",
        "transaction_id": "SUP03-001",
        "harga_pengiriman": 50000,
        "lama_pengiriman": "2 hari"
    }

Catatan:
Jangan lupa untuk mengganti URL distributor di dalam kode (ISI URL DARI DIS01, ISI URL DARI DIS02) sesuai dengan endpoint API distributor yang sebenarnya.
Pastikan Firebase Firestore telah diatur dengan benar dan memiliki koleksi **tbl_produk**, **tbl_transaksi**, **tbl_invoice**, dan **tbl_checkout**.
