from flask import Flask, request, jsonify
import requests
from firebase_admin import credentials, firestore
import firebase_admin as fa
import uuid
app = Flask(__name__)

# Import Credentials Firebase
file_cred = credentials.Certificate("cfg/configfirebase.json")
fa.initialize_app(file_cred)

db = firestore.client()

#  _______  _______  ___  
# |   _   ||       ||   | 
# |  |_|  ||    _  ||   | 
# |       ||   |_| ||   | 
# |       ||    ___||   | 
# |   _   ||   |    |   | 
# |__| |__||___|    |___| 

@app.route('/api/suppliers', methods=['GET'])
def get_suppliers():
    try:
        # Akses koleksi db_produk
        suppliers = {
            "id": "SUP03",
            "nama_sup": "Supplier 03",
            "kota": "Surakarta",
            "tipe": "Sparepart"
        }
        return jsonify(suppliers), 200  # Mengembalikan semua produk dalam format JSON
    except Exception as e:
        return jsonify("FALSE"), 400

# POST -> Cek Harga dari Distributor
@app.route('/api/cek_harga', methods=['POST'])
def cek_harga():
    data = request.json

    try:
        collTransaksi = db.collection('tbl_transaksi')
        data_transaksi = collTransaksi.stream()
        indexing = sum(1 for _ in data_transaksi) + 1  # Hitung berapa kali cek harga dilakukan sebelumnya

        # Generate id_log dengan format "SUP01RET03DIS01"
        id_log = f"SUP03RET03DIS01-{indexing:0d}"  # 000 di bagian akhir menandakan cek harga ke berapa
        # id_log tergantung dari RETAIL DAN DISTRIBUTOR BERAPA
        
        inputTransaksi = {
            "id_log": id_log,
            "id_retail": data["id_retail"],
            "id_distributor": data['id_distributor'],
            "kota_tujuan": data['kota_tujuan'],
            "total_berat_barang": data['total_berat_barang'],
            "total_harga_barang": data['total_harga_barang'],
        }

        collTransaksi.document(id_log).set(inputTransaksi)

        collInvoice = db.collection('tbl_invoice')
        for item in data['cart']:
            order_data = {
                "id_log": id_log,  # Menggunakan id_log yang sama
                "id_produk": item['id_produk'],
                "quantity": item['quantity']
            }
            collInvoice.add(order_data)

        # Cek ongkir dari distributor
        
        # Ini IP dari distributor ASFA -> bikin IF else
        respOngkir = requests.post(f"http://159.223.41.243:8000/api/distributors6/orders/cek_ongkir", json={
            "id_log": id_log,  # Menggunakan id_log yang baru di-generate
            "kota_asal": "Surakarta",
            "kota_tujuan": data['kota_tujuan'],
            "quantity": sum(item['quantity'] for item in data['cart']),  # Total quantity dari semua produk
            "berat": data['total_berat_barang']
        })
        
        dataOngkir = respOngkir.json()

        # Update data transaksi dengan harga pengiriman dan lama pengiriman
        inputTransaksi.update({
            "harga_pengiriman": dataOngkir['harga_pengiriman'],  # Mengambil harga_pengiriman dari respons
            "lama_pengiriman": dataOngkir.get('lama_pengiriman')  # Mengambil lama_pengiriman jika ada
        })

        # Simpan transaksi ke tbl_transaksi dengan id_log yang dihasilkan
        collTransaksi.document(id_log).set(inputTransaksi)

        if respOngkir.status_code != 200:
            return jsonify({"error": "Gagal mendapatkan ongkir dari distributor"}), 400

        return jsonify({
            "pesan": "Cek harga berhasil",
            "transaction_id": id_log,  # Menggunakan id_log yang baru di-generate
            "harga_pengiriman": dataOngkir['harga_pengiriman'],
            "lama_pengiriman": dataOngkir.get('lama_pengiriman')
        }), 200

    except Exception as e:
        return jsonify("FALSE"), 500

@app.route('/api/checkout', methods=['POST'])
def checkout():
    data = request.json
    try:
        collTransaksi = db.collection('tbl_transaksi').document(data['id_log'])
        data_transaksi = collTransaksi.get()

        if not data_transaksi.exists:
            return jsonify({"error": "NOT FOUND"}), 404

        transaction_data = data_transaksi.to_dict()

        # Melakukan pemesanan ke distributor
        checkOutResp = requests.post(f"http://159.223.41.243:8000/api/distributors6/orders/fix_kirim", json={
            "id_log": data['id_log']
        })
        data_checkout = checkOutResp.json()

        # Membuat objek Pembelian baru
        fixCheckout = {
            "id_log": collTransaksi,  # Menggunakan referensi ke dokumen
            "total_harga_barang": transaction_data['total_harga_barang'],
            "total_berat_barang": transaction_data['total_berat_barang'],
            "no_resi": data_checkout['no_resi'],  # Mengambil no_resi dari respons
            "harga_pengiriman": data_checkout['harga_pengiriman'],
            "lama_pengiriman": data_checkout.get('lama_pengiriman'),  # Mengambil harga_pengiriman dari respons
            "tanggal_pembelian": firestore.SERVER_TIMESTAMP  # Menggunakan timestamp server
        }

        # Simpan pembelian baru ke Firestore
        db.collection('tbl_checkout').add(fixCheckout)

        return jsonify({
            "message": "Pemesanan berhasil dilakukan",
            "purchase_id": collTransaksi.id,  # Menggunakan id dari referensi
            "no_resi": data_checkout['no_resi'],
            "harga_pengiriman": data_checkout['harga_pengiriman'],
            "lama_pengiriman": data_checkout.get('lama_pengiriman') 
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400

#  _______  ______    __   __  ______  
# |       ||    _ |  |  | |  ||      | 
# |       ||   | ||  |  | |  ||  _    |
# |       ||   |_||_ |  |_|  || | |   |
# |      _||    __  ||       || |_|   |
# |     |_ |   |  | ||       ||       |
# |_______||___|  |_||_______||______| 

# Create
@app.route('/api/products', methods=['POST'])
def add_product():
    collProduct = db.collection('tbl_produk')
    data_product = collProduct.stream()
    indexing = sum(1 for _ in data_product) + 1
    id_log = f"{indexing:0d}"
    try:
        # Nilai default yang ditetapkan untuk produk baru
        product_data = {
            "berat" : float(request.form.get('berat', 0)),
            "deskripsi" : request.form.get('deskripsi', '-'),
            "harga" : int(request.form.get('harga', 0)),
            "jml_stok" : int(request.form.get('jml_stok', 0)),
            "nama_produk" : request.form.get('nama_produk', '-'),
            "id_produk" : id_log
            }
        
        new_doc_ref = db.collection('tbl_produk').document()
        product_data['id_produk'] = new_doc_ref.id  
        new_doc_ref.set(product_data)
        
        return jsonify("TRUE"), 201
    except Exception as e:
        return jsonify("FALSE"), 400
    
# Read
@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        # Akses koleksi db_produk
        collProduk = db.collection('tbl_produk')
        products = []

        # Mendapatkan data dari setiap dokumen dalam koleksi db_produk
        for doc in collProduk.stream():
            product_data = doc.to_dict()  # Ambil semua field dari dokumen
            product_data['id_produk'] = doc.id
            products.append(product_data)

        return jsonify(products), 200  # Mengembalikan semua produk dalam format JSON
    except Exception as e:
        return jsonify("FALSE"), 400

# Update 
@app.route('/api/products/<product_id>', methods=['PUT'])
def update_product(product_id):
    try:
        # Mengambil data produk yang diperbarui dari request JSON
        product_data = {
            "berat" : float(request.form.get('berat', 0)),
            "deskripsi" : request.form.get('deskripsi', '-'),
            "harga" : int(request.form.get('harga', 0)),
            "jml_stok" : int(request.form.get('jml_stok', 0)),
            "nama_produk" : request.form.get('nama_produk', '-'),
            }
        if not product_data:
            return jsonify("NO DATA"), 400
        
        # Membuat referensi ke dokumen spesifik berdasarkan product_id
        collProduk = db.collection('tbl_produk').document(product_id)
        
        if collProduk.get().exists:
            collProduk.update(product_data)  # Memperbarui dokumen dengan data baru
            return jsonify("TRUE"), 200
        else:
            return jsonify("NOT FOUND"), 404
    except Exception as e:
        return jsonify("FALSE"), 400

# Delete
@app.route('/api/products/<product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        # Membuat referensi ke dokumen spesifik berdasarkan product_id
        collProduk = db.collection('tbl_produk').document(product_id)
        
        if collProduk.get().exists:
            collProduk.delete()  # Menghapus dokumen
            return jsonify("TRUE"), 200
        else:
            return jsonify("NOT FOUND"), 404
    except Exception as e:
        return jsonify("FALSE"), 400

# Update Stock
@app.route('/api/update_stock', methods=['POST'])
def update_stock():
    data = request.json
        
    try:
        # Validasi nomor resi
        resi = data.get('no_resi')
        if not resi:
            return jsonify({"error": "Nomor resi harus diisi"}), 400

        # Ambil transaksi berdasarkan id_log
        collInvoice = db.collection('tbl_invoice').where('id_log', '==', data['id_log']).get()

        # Cek apakah transaksi ditemukan
        if not collInvoice or len(collInvoice) == 0:
            return jsonify({"error": "Transaksi not found"}), 404

        # Cek status pengiriman menggunakan no_resi
        respStatus = requests.get(f"http://159.223.41.243:8000/api/status/{resi}")
        
        # Cek jika request berhasil
        if respStatus.status_code != 200:
            return jsonify({"error": "Gagal mengambil status pengiriman"}), 400
        
        dataStatus = respStatus.json()

        if dataStatus.get('status') != "On Progress":
            stocks_deducted = []

            # Kurangi stok untuk setiap transaksi
            for order in collInvoice:
                # Ambil ID produk dan jumlah
                order_dict = order.to_dict()
                id_produk = str(order_dict.get('id_produk'))
                quantity = order_dict.get('quantity', 0)

                # Ambil data produk
                collProduk = db.collection('tbl_produk').document(id_produk)
                dataProduk = collProduk.get()

                if dataProduk.exists:
                    stock_sekarang = dataProduk.to_dict().get('jml_stok', 0)
                    new_stock = stock_sekarang - quantity

                    if new_stock < 0:
                        return jsonify({"error": f"Stok untuk produk {id_produk} tidak mencukupi"}), 400

                    # Update stok
                    collProduk.update({"jml_stok": new_stock})

                    # Tambahkan ke daftar produk yang stoknya dikurangi
                    stocks_deducted.append({
                        "id_produk": id_produk,
                        "new_stock": new_stock
                    })
                else:
                    return jsonify({"error": f"Produk {id_produk} not found"}), 404

            return jsonify({
                "message": "Stock updated",
                "stocks_deducted": stocks_deducted
            }), 200
        else:
            return jsonify({"error": "Status hasn't changed"}), 400

    except requests.exceptions.RequestException as e:
        # Jika ada error pada request API eksternal
        return jsonify({"error": f"Error in fetching delivery status: {str(e)}"}), 500
    except Exception as e:
        # General error handler
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)