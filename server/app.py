from flask import Flask, request, jsonify
from firebase_admin import credentials, firestore
import firebase_admin as fa
import uuid
app = Flask(__name__)

# Import Credentials Firebase
file_cred = credentials.Certificate("configfirebase.json")
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
            "id": "SUP003",
            "nama_sup": "Supplier 03",
            "kota": "Surakarta",
            "tipe": "Sparepart"
        }
        return jsonify(suppliers), 200  # Mengembalikan semua produk dalam format JSON
    except Exception as e:
        return jsonify("FALSE"), 400

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
        # Nilai default yang ditetapkan untuk produk baru
        product_data = {
            "berat" : float(request.form.get('berat', 0)),
            "deskripsi" : request.form.get('deskripsi', '-'),
            "harga" : int(request.form.get('harga', 0)),
            "jml_stok" : int(request.form.get('jml_stok', 0)),
            "nama_produk" : request.form.get('nama_produk', '-'),
            "id_produk" : uuid.uuid4()
            }
        
        # Menambahkan data produk ke dalam koleksi 'tbl_produk'
        new_doc_ref = db.collection('tbl_produk').document()  # Membuat dokumen baru
        product_data['id_produk'] = new_doc_ref.id  # Set id_produk to the new document ID
        new_doc_ref.set(product_data)  # Menyimpan data produk
        
        return jsonify("TRUE"), 201
    except Exception as e:
        return jsonify("FALSE"), 400
    
# Read
@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        # Akses koleksi db_produk
        products_ref = db.collection('tbl_produk')
        products = []

        # Mendapatkan data dari setiap dokumen dalam koleksi db_produk
        for doc in products_ref.stream():
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
        doc_ref = db.collection('tbl_produk').document(product_id)
        
        if doc_ref.get().exists:
            doc_ref.update(product_data)  # Memperbarui dokumen dengan data baru
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
        doc_ref = db.collection('tbl_produk').document(product_id)
        
        if doc_ref.get().exists:
            doc_ref.delete()  # Menghapus dokumen
            return jsonify("TRUE"), 200
        else:
            return jsonify("NOT FOUND"), 404
    except Exception as e:
        return jsonify("FALSE"), 400


if __name__ == "__main__":
    app.run(debug=True)