/* =====================================================
   KALKULATOR ILMIAH - script.js
   Bagian 1: Data       | Bagian 2: Tampilan layar
   Bagian 3: Aksi dasar | Bagian 4: Fungsi ilmiah
   Bagian 5: Klik tombol | Bagian 6: Keyboard
   ===================================================== */


// ====== 1. Data yang disimpan kalkulator ======
let angkaSekarang = "0";   // angka yang sedang diketik
let angkaSebelumnya = "";  // angka pertama sebelum operator
let operatorAktif = "";    // + − × ÷ ^
let timpaLayar = false;    // true = ketikan berikutnya mengganti layar
let riwayatSelesai = "";   // hitungan yang sudah selesai, mis. "50 × 3 ="
let modeSudut = "DEG";     // "DEG" = derajat, "RAD" = radian
let operandSiap = false;   // true = angka di layar hasil fungsi (sin, √, dll) dan siap dipakai

const kalkulator = document.querySelector(".kalkulator");
const layarAngka = document.getElementById("angka");
const layarRiwayat = document.getElementById("riwayat");
const panelIlmiah = document.getElementById("panelIlmiah");
const tombolIlmiah = document.getElementById("tombolIlmiah");
const tombolSudut = document.getElementById("tombolSudut");


// ====== 2. Menampilkan hasil ke layar ======
function tampilkan() {
  // Tampilkan angka dengan koma (gaya Indonesia)
  layarAngka.textContent = angkaSekarang.replace(".", ",");

  if (operatorAktif) {
    // Sedang menghitung: tampilkan "50 ×"
    layarRiwayat.textContent = angkaSebelumnya.replace(".", ",") + " " + operatorAktif;
  } else if (timpaLayar) {
    // Baru selesai menghitung: tampilkan "50 × 3 =" atau "sin(30) ="
    layarRiwayat.textContent = riwayatSelesai;
  } else {
    // Sedang mengetik angka baru: riwayat dikosongkan
    layarRiwayat.textContent = "";
  }
}

// Merapikan hasil: membulatkan, dan mengubah jadi "Error" kalau tidak valid
function rapikan(x) {
  if (!isFinite(x)) return "Error";   // NaN atau tak terhingga
  // Membulatkan supaya 0.1 + 0.2 tidak menjadi 0.30000000000000004
  const bulat = parseFloat(x.toFixed(10));
  // Angka sangat besar ditulis ringkas, mis. 1.5e+20
  if (Math.abs(bulat) >= 1e12) return String(Number(bulat.toExponential(6)));
  return String(bulat);
}


// ====== 3. Aksi tombol dasar ======
function ketikAngka(n) {
  operandSiap = false;
  if (timpaLayar || angkaSekarang === "0" || angkaSekarang === "Error") {
    angkaSekarang = n;
    timpaLayar = false;
  } else if (angkaSekarang.length < 12) {
    angkaSekarang += n;
  }
}

function ketikDesimal() {
  operandSiap = false;
  if (timpaLayar || angkaSekarang === "Error") {
    angkaSekarang = "0";
    timpaLayar = false;
  }
  if (!angkaSekarang.includes(".")) angkaSekarang += ".";
}

function hitung(a, b, op) {
  a = parseFloat(a);
  b = parseFloat(b);
  let hasil;
  if (op === "+") hasil = a + b;
  if (op === "−") hasil = a - b;
  if (op === "×") hasil = a * b;
  if (op === "^") hasil = Math.pow(a, b);
  if (op === "÷") {
    if (b === 0) return "Error"; // tidak boleh dibagi nol
    hasil = a / b;
  }
  return rapikan(hasil);
}

function pilihOperator(op) {
  if (angkaSekarang === "Error") return;
  // Kalau sudah ada hitungan berjalan, selesaikan dulu (mis. 2 + 3 + ...)
  if (operatorAktif && (!timpaLayar || operandSiap)) {
    angkaSekarang = hitung(angkaSebelumnya, angkaSekarang, operatorAktif);
  }
  if (angkaSekarang === "Error") {
    operatorAktif = "";
    operandSiap = false;
    return;
  }
  angkaSebelumnya = angkaSekarang;
  operatorAktif = op;
  timpaLayar = true;
  operandSiap = false;
}

function tekanSamaDengan() {
  if (!operatorAktif || angkaSekarang === "Error") return;

  // Simpan hitungan lengkap sebelum dihitung, mis. "50 × 3 ="
  riwayatSelesai =
    angkaSebelumnya.replace(".", ",") + " " + operatorAktif + " " +
    angkaSekarang.replace(".", ",") + " =";

  angkaSekarang = hitung(angkaSebelumnya, angkaSekarang, operatorAktif);
  operatorAktif = "";
  angkaSebelumnya = "";
  timpaLayar = true;
  operandSiap = false;
}

function hapusSemua() {
  angkaSekarang = "0";
  angkaSebelumnya = "";
  operatorAktif = "";
  riwayatSelesai = "";
  timpaLayar = false;
  operandSiap = false;
}

function hapusSatu() {
  if (timpaLayar || angkaSekarang === "Error") return;
  let sisa = angkaSekarang.slice(0, -1);
  if (sisa === "" || sisa === "-") sisa = "0";   // jangan sampai tersisa "-" saja
  angkaSekarang = sisa;
}

function persen() {
  if (angkaSekarang === "Error") return;
  angkaSekarang = String(parseFloat(angkaSekarang) / 100);
  riwayatSelesai = "";   // kosongkan riwayat lama
  timpaLayar = false;    // sembunyikan riwayat
}


// ====== 4. Fungsi ilmiah ======

// Mengubah sudut ke radian kalau mode DEG (derajat)
function keRadian(x) {
  return modeSudut === "DEG" ? x * Math.PI / 180 : x;
}

// Faktorial: 5! = 5 × 4 × 3 × 2 × 1
function faktorial(n) {
  if (!Number.isInteger(n) || n < 0 || n > 170) return NaN;
  let hasil = 1;
  for (let i = 2; i <= n; i++) hasil *= i;
  return hasil;
}

// Menghitung satu fungsi untuk angka x. NaN artinya tidak valid (nanti jadi "Error")
function hitungFungsi(nama, x) {
  switch (nama) {
    case "sin": return Math.sin(keRadian(x));
    case "cos": return Math.cos(keRadian(x));
    case "tan":
      // tan 90° tidak terdefinisi
      if (modeSudut === "DEG" && Math.abs(x % 180) === 90) return NaN;
      return Math.tan(keRadian(x));
    case "log": return x > 0 ? Math.log10(x) : NaN;
    case "ln": return x > 0 ? Math.log(x) : NaN;
    case "akar": return x >= 0 ? Math.sqrt(x) : NaN;
    case "kuadrat": return x * x;
    case "kebalikan": return x === 0 ? NaN : 1 / x;
    case "faktorial": return faktorial(x);
  }
  return NaN;
}

// Tulisan untuk baris riwayat, mis. "sin(30) =" atau "√(16) ="
function labelFungsi(nama, teks) {
  switch (nama) {
    case "akar": return "√(" + teks + ")";
    case "kuadrat": return "(" + teks + ")²";
    case "kebalikan": return "1/(" + teks + ")";
    case "faktorial": return "(" + teks + ")!";
    default: return nama + "(" + teks + ")";
  }
}

function terapkanFungsi(nama) {
  if (angkaSekarang === "Error") return;
  const x = parseFloat(angkaSekarang);
  riwayatSelesai = labelFungsi(nama, angkaSekarang.replace(".", ",")) + " =";
  angkaSekarang = rapikan(hitungFungsi(nama, x));
  timpaLayar = true;
  operandSiap = true;
}

// Memasukkan π atau e ke layar
function masukkanKonstanta(nama) {
  if (nama === "pi") angkaSekarang = rapikan(Math.PI);
  if (nama === "e") angkaSekarang = rapikan(Math.E);
  riwayatSelesai = "";
  timpaLayar = true;
  operandSiap = true;
}

// Tombol ±: ubah angka jadi negatif/positif
function gantiTanda() {
  if (angkaSekarang === "Error" || angkaSekarang === "0") return;
  // Kalau sedang menunggu angka kedua, abaikan
  if (operatorAktif && timpaLayar && !operandSiap) return;
  angkaSekarang = angkaSekarang.startsWith("-")
    ? angkaSekarang.slice(1)
    : "-" + angkaSekarang;
  if (!operatorAktif) riwayatSelesai = "";
}

// Tombol DEG/RAD: ganti satuan sudut
function gantiSudut() {
  modeSudut = modeSudut === "DEG" ? "RAD" : "DEG";
  tombolSudut.textContent = modeSudut;
}

// Tombol "Ilmiah": buka/tutup panel
function gantiPanelIlmiah() {
  const akanDibuka = panelIlmiah.hidden;   // sekarang tersembunyi → akan dibuka
  panelIlmiah.hidden = !akanDibuka;
  kalkulator.classList.toggle("ilmiah-aktif", akanDibuka);
  tombolIlmiah.setAttribute("aria-expanded", String(akanDibuka));
}


// ====== 5. Menangkap klik pada semua tombol ======
kalkulator.addEventListener("click", function (e) {
  const tombol = e.target.closest("button");
  if (!tombol) return;

  const aksi = tombol.dataset.aksi;
  const nilai = tombol.dataset.nilai;

  if (aksi === "angka") ketikAngka(nilai);
  if (aksi === "desimal") ketikDesimal();
  if (aksi === "operator") pilihOperator(nilai);
  if (aksi === "hasil") tekanSamaDengan();
  if (aksi === "hapus-semua") hapusSemua();
  if (aksi === "hapus") hapusSatu();
  if (aksi === "persen") persen();
  if (aksi === "fungsi") terapkanFungsi(nilai);
  if (aksi === "konstanta") masukkanKonstanta(nilai);
  if (aksi === "tanda") gantiTanda();
  if (aksi === "sudut") gantiSudut();
  if (aksi === "saklar") gantiPanelIlmiah();

  tampilkan();
});


// ====== 6. Bisa juga memakai keyboard ======
document.addEventListener("keydown", function (e) {
  if (e.key >= "0" && e.key <= "9") ketikAngka(e.key);
  else if (e.key === "." || e.key === ",") ketikDesimal();
  else if (e.key === "+") pilihOperator("+");
  else if (e.key === "-") pilihOperator("−");
  else if (e.key === "*") pilihOperator("×");
  else if (e.key === "^") pilihOperator("^");
  else if (e.key === "%") persen();
  else if (e.key === "!") terapkanFungsi("faktorial");
  else if (e.key === "/") { e.preventDefault(); pilihOperator("÷"); }
  else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); tekanSamaDengan(); }
  else if (e.key === "Backspace") hapusSatu();
  else if (e.key === "Escape") hapusSemua();
  else return;
  tampilkan();
});


// Tampilkan layar pertama kali saat halaman dibuka
tampilkan();
