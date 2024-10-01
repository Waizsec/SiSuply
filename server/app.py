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
            "tipe": "Sparepart",
            "pemilik": "Kelompok 03",
            "deskripsi": "Toko Sparepart 03 kami, yang telah berdiri sejak tahun 2024, berkomitmen untuk menyediakan sparepart sepeda berkualitas tinggi bagi para pecinta sepeda. Kami menawarkan berbagai macam komponen sepeda, mulai dari rem yang presisi, rantai tahan lama, grip yang nyaman, pedal yang kokoh, saddle ergonomis, hingga bar tape dengan daya cengkeram yang optimal. Setiap produk yang kami jual dipilih dengan cermat untuk memastikan performa terbaik, kenyamanan, dan keamanan bersepeda. Dengan pengalaman dan dedikasi dalam industri, kami selalu berusaha memberikan pelayanan terbaik kepada pelanggan kami."
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
        id_log = f"SUP03-{indexing:0d}"  # 000 di bagian akhir menandakan cek harga ke berapa
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
        if inputTransaksi["id_distributor"] == "DIS03":
            respOngkir = requests.post("http://159.223.41.243:8000/api/distributors6/orders/cek_ongkir", json={
                "id_log": id_log,  # Menggunakan id_log yang baru di-generate
                "kota_asal": "Surakarta",
                "kota_tujuan": data['kota_tujuan'],
                "quantity": sum(item['quantity'] for item in data['cart']),  # Total quantity dari semua produk
                "berat": data['total_berat_barang']
            })
        elif inputTransaksi["id_distributor"] == "DIS02":
            respOngkir = requests.post("http://143.244.170.95:8000/api/distributor5/orders/cek_ongkir", json={
                "id_log": id_log,  # Menggunakan id_log yang baru di-generate
                "kota_asal": "Surakarta",
                "kota_tujuan": data['kota_tujuan'],
                "quantity": sum(item['quantity'] for item in data['cart']),  # Total quantity dari semua produk
                "berat": data['total_berat_barang']
            })
        elif inputTransaksi["id_distributor"] == "DIS01":
            respOngkir = requests.post("http://159.223.41.243:8000/api/distributors6/orders/cek_ongkir", json={
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
        transaction_data = data_transaksi.to_dict()
        
        if not data_transaksi.exists:
            return jsonify({"error": "NOT FOUND"}), 404

        if transaction_data["id_distributor"] == "DIS03":
            # Melakukan pemesanan ke distributor
            checkOutResp = requests.post(f"http://159.223.41.243:8000/api/distributors6/orders/fix_kirim", json={
                "id_log": data['id_log']
            })
        elif transaction_data["id_distributor"] == "DIS02":
            # Melakukan pemesanan ke distributor
            checkOutResp = requests.post(f"http://143.244.170.95:8000/api/distributor5/orders/fix_kirim", json={
                "id_log": data['id_log']
            })
        elif transaction_data["id_distributor"] == "DIS01":
            # Melakukan pemesanan ke distributor
            checkOutResp = requests.post(f"http://159.223.41.243:8000/api/distributors6/orders/fix_kirim", json={
                "id_log": data['id_log']
            })
        data_checkout = checkOutResp.json()

        collInvoice = db.collection('tbl_invoice').where('id_log', '==', data['id_log']).get()
        if not collInvoice or len(collInvoice) == 0:
            return jsonify({"error": "Transaksi not found"}), 404
        
        stocks_deducted = []
        for order in collInvoice:
        # Ambil ID produk dan jumlah
            order_dict = order.to_dict()
            id_produk = str(order_dict.get('id_produk'))
            quantity = order_dict.get('quantity', 0)

            # Ambil data produk
            collProduk = db.collection('tbl_produk').document(id_produk)
            dataProduk = collProduk.get()

            if dataProduk.exists:
                stock_sekarang = dataProduk.to_dict().get('stock', 0)
                new_stock = stock_sekarang - quantity

                if new_stock < 0:
                    return jsonify({"error": f"Stok untuk produk {id_produk} tidak mencukupi"}), 400

                # Update stok
                collProduk.update({
                    "stock": new_stock
                })
                
                stocks_deducted.append({
                            "id_produk": id_produk,
                            "new_stock": new_stock
                        })
            else:
                return jsonify({"error": f"Produk {id_produk} not found"}), 404
        
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
            "lama_pengiriman": data_checkout.get('lama_pengiriman'),
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
    try:
        # Ambil semua data dari koleksi produk
        collProduct = db.collection('tbl_produk')
        data_product = collProduct.stream()
        
        # Hitung jumlah produk untuk menentukan ID berikutnya
        indexing = sum(1 for _ in data_product) + 1
        id_log = f"P03-{indexing:0d}"  # Mengatur format id_log dengan leading zero (misal 0001, 0002, dst.)
        
        # Nilai default yang ditetapkan untuk produk baru
        product_data = {
            "berat": float(request.form.get('berat', 0)),
            "deskripsi": request.form.get('deskripsi', '-'),
            "harga": int(request.form.get('harga', 0)),
            "stock": int(request.form.get('stock', 0)),
            "nama_produk": request.form.get('nama_produk', '-'),
            "link_gambar": request.form.get('link_gambar', '-'),
            "id_produk": id_log  # Gunakan id_log sebagai id_produk
        }
        
        # Simpan data produk baru dengan id_produk yang sudah dihitung
        new_doc_ref = collProduct.document(id_log)
        new_doc_ref.set(product_data)
        
        return jsonify({"success": True, "id_produk": id_log}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400
    
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
        # Referensi ke dokumen produk berdasarkan product_id
        collProduk = db.collection('tbl_produk').document(product_id)
        doc = collProduk.get()

        # Jika produk tidak ditemukan
        if not doc.exists:
            return jsonify("NOT FOUND"), 404

        # Mengambil data produk yang ada dari Firestore
        current_data = doc.to_dict()

        # Mengambil data dari form request
        product_data = {
            "berat": float(request.form.get('berat', current_data.get('berat', 0))),
            "deskripsi": request.form.get('deskripsi', current_data.get('deskripsi', '-')),
            "harga": int(request.form.get('harga', current_data.get('harga', 0))),
            "stock": int(request.form.get('stock', current_data.get('stock', 0))),
            "nama_produk": request.form.get('nama_produk', current_data.get('nama_produk', '-')),
            "link_gambar": request.form.get('link_gambar', current_data.get('link_gambar', '-'))
        }

        # Memperbarui dokumen dengan data baru
        collProduk.update(product_data)
        return jsonify("TRUE"), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400


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

# Tabel Transaksi
@app.route('/api/get_transaksi', methods=['GET'])
def get_transaksi():
    try:
        # Ambil seluruh data dari tbl_transaksi
        transaksi_data = db.collection('tbl_transaksi').stream()
        transaksi_list = [doc.to_dict() for doc in transaksi_data]
        
        result = []

        # Iterasi setiap transaksi berdasarkan id_log
        for transaksi in transaksi_list:
            id_log = transaksi.get('id_log')
            id_distributor = transaksi.get('id_distributor', 'Unknown')  # Ambil id_distributor
            id_retail = transaksi.get('id_retail', 'Unknown')  # Ambil id_retail
            
            # Ambil seluruh data dari tbl_invoice berdasarkan id_log
            invoice_data = db.collection('tbl_invoice').where('id_log', '==', id_log).stream()
            invoice_list = [doc.to_dict() for doc in invoice_data]

            # Jika tidak ada invoice untuk transaksi ini, lanjut ke transaksi berikutnya
            if not invoice_list:
                continue
            
            # Ambil data dari tbl_checkout, pastikan id_log diperlakukan sebagai referensi
            checkout_data = db.collection('tbl_checkout').where('id_log', '==', db.document(f'tbl_transaksi/{id_log}')).stream()
            checkout_list = [doc.to_dict() for doc in checkout_data]
            
            # Data yang akan kita simpan untuk transaksi ini
            transaksi_result = {
                "id_log": id_log,
                "id_distributor": id_distributor,  # Tambahkan id_distributor
                "id_retail": id_retail,  # Tambahkan id_retail
                "produk": [],
                "subtotal": transaksi.get('total_harga_barang', 0),
                "tanggal_pembelian": "",
                "no_resi": ""
            }
            
            unique_resi = set()
            for checkout in checkout_list:
                no_resi = checkout.get('no_resi')
                tanggal_pembelian = checkout.get('tanggal_pembelian')

                # Cek jika no_resi belum ada di set
                if no_resi not in unique_resi:
                    # Jika belum ada, tambahkan ke set
                    unique_resi.add(no_resi)
                    
                    # Tambahkan data ke transaksi_result
                    transaksi_result['tanggal_pembelian'] = tanggal_pembelian
                    transaksi_result['no_resi'] = no_resi
            
            # Iterasi setiap invoice dan ambil data produk dari tbl_produk
            for invoice in invoice_list:
                id_produk = invoice.get('id_produk')
                quantity = invoice.get('quantity', 0)

                # Ambil data produk dari tbl_produk
                produk_ref = db.collection('tbl_produk').document(str(id_produk))
                produk_data = produk_ref.get()

                if produk_data.exists:
                    produk_info = produk_data.to_dict()
                    harga = produk_info.get('harga', 0)
                    nama_produk = produk_info.get('nama_produk', '-')

                    # Hitung total harga untuk produk ini
                    total = harga * quantity

                    # Tambahkan detail produk ke transaksi_result
                    transaksi_result['produk'].append({
                        "id_produk": id_produk,
                        "nama_produk": nama_produk,
                        "quantity": quantity,
                        "harga": harga,
                        "total": total
                    })

            # Tambahkan transaksi_result ke hasil akhir
            result.append(transaksi_result)

        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)