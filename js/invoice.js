new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: {
    kop: {
      teleponToko: null,
      nama: null,
      alamat: null,
      telepon: null,
      invoiceKe: null,
      tgl: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      jthTempo: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
    },
    keranjangBarang: [],
    add: {
      no: 0,
      qty: null,
      satuan: null,
      description: null,
      unitPrice: null,
      amount: null,
    },
    totalBelanjaAngka: 0,
    totalBelanjaString: null,
    totalBelanjaTerbilang: 'Nol',
    dialogEdit: false,

    ////
    date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    menu: false,
    date1: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    menu1: false,
  },
  computed: {
    computedDateFormattedMomentjs() {
      moment.locale('id');
      return this.date ? moment(this.date).format('Do MMMM YYYY') : ''
    },
    computedDateFormattedMomentjs1() {
      moment.locale('id');
      return this.date1 ? moment(this.date1).format('Do MMMM YYYY') : ''
    },
  },
  mounted() {
    this.$refs.refKopTeleponToko.focus();
    this.totalBelanjaString = this.formatRupiah(this.totalBelanjaAngka.toString(), 'Rp.')
    //this.totalBelanjaTerbilang = this.terbilang(parseInt(this.totalBelanjaAngka));
  },

  methods: {
    focusInputTeleponToko() {
      this.$refs.refKopTeleponToko.focus();
    },
    focusInputNama() {
      this.$refs.refKopNama.focus();
    },
    focusInputAlamat() {
      this.$refs.refKopAlamat.focus();
    },
    focusInputNoTelepon() {
      this.$refs.refKopTelepon.focus();
    },
    focusInputNoInvoice() {
      this.$refs.refKopInvoiceKe.focus();
    },
    focusInputNamaBarang() {
      this.$refs.refNamaBarang.focus();
    },
    focusInputQty() {
      this.$refs.inputQty.focus();
    },
    focusInputSatuan() {
      this.$refs.inputSatuan.focus();
    },
    focusInputHarga() {
      this.$refs.inputHarga.focus();
    },
    addKeranjang() {
      if (this.add.qty == null || this.add.unitPrice == null || this.add.satuan == null) return false;
      if (this.add.qty == '' || this.add.unitPrice == '' || this.add.satuan == '') return false;
      const qq = this.add.qty
      const ss = this.add.satuan
      const uu = this.add.unitPrice
      const a = this.add.qty * this.add.unitPrice

      const dorong = {
        no: this.add.no + 1,
        qty: qq,
        satuan: ss.toString().toUpperCase(),
        qtyTampil: this.formatAngka(qq.toString()),
        description: this.add.description.toString().toUpperCase(),
        unitPrice: this.add.unitPrice,
        unitPriceTampil: this.formatAngka(uu.toString()),
        amount: this.add.qty * this.add.unitPrice,
        amountTampil: this.formatAngka(a.toString()),
      }
      this.keranjangBarang.push(dorong);
      this.totalFinal();
      this.kosongForm();
      this.$refs.refNamaBarang.focus();
    },
    kosongForm() {
      this.add.qty = null
      this.add.description = null
      this.add.unitPrice = null
    },
    totalFinal() {
      this.totalBelanjaAngka = 0;
      for (let i = 0; i < this.keranjangBarang.length; i++) {
        const element = this.keranjangBarang[i];
        this.totalBelanjaAngka += parseInt(element.amount)
      }
      this.totalBelanjaString = this.formatRupiah(this.totalBelanjaAngka.toString(), 'Rp.');
      const bb = angkaTerbilang(this.totalBelanjaAngka);
      let b1 = bb.split(' ');
      b2 = this.kapitalisasiKata(b1[0]);
      let b3 = [b2];
      let c1 = b1.splice(1);
      for (let i = 0; i < c1.length; i++) {
        b3.push(c1[i])
      }
      this.totalBelanjaTerbilang = b3.join(' ');//this.kapitalisasiKata(angkaTerbilang(this.totalBelanjaAngka));//this.terbilang(this.totalBelanjaAngka); //
      console.log('hasil b3', b3.join(' '));
      console.log('total angka : ', this.totalBelanjaAngka);
      console.log('total string: ', this.totalBelanjaString);
      console.log('total terbilang: ', this.totalBelanjaTerbilang);//this.totalBelanjaTerbilang);
    },
    kapitalisasiKata(str) {
      return str.replace(/\w\S*/g, function (kata) {
        const kataBaru = kata.slice(0, 1).toUpperCase() + kata.substr(1);
        return kataBaru
      });

    },
    setEdit(item) {
      this.add.no = item.no
      this.add.qty = item.qty
      this.add.satuan = item.satuan
      this.add.description = item.description
      this.add.unitPrice = item.unitPrice
      this.dialogEdit = true
    },
    updateKeranjang() {
      const index = this.keranjangBarang.findIndex(ind => {
        return ind.no == this.add.no
      });
      if (index !== -1) {
        const qq = this.add.qty,
          uu = this.add.unitPrice,
          a = this.add.qty * this.add.unitPrice;

        this.keranjangBarang[index].qty = this.add.qty
        this.keranjangBarang[index].satuan = this.add.satuan
        this.keranjangBarang[index].unitPrice = this.add.unitPrice
        this.keranjangBarang[index].amount = 0 + (this.add.qty * this.add.unitPrice)
        this.keranjangBarang[index].qtyTampil = this.formatAngka(qq.toString())
        this.keranjangBarang[index].unitPriceTampil = this.formatAngka(uu.toString())
        this.keranjangBarang[index].amountTampil = this.formatAngka(a.toString())
        this.dialogEdit = false;
      }
      this.totalFinal()
      this.kosongForm()
    },
    hapusItem(item) {
      const index = this.keranjangBarang.findIndex(ind => {
        return ind.no == item.no
      });
      if (index !== -1) {
        this.keranjangBarang.splice(index, 1)
      }
      this.totalFinal()
    },
    lihatPdf() {
      console.log('inig kop.tgl :', this.kop.tgl);
      console.log('inig kop.jthTempo :', this.kop.jthTempo);

      if (this.kop.nama == '' || this.kop.invoiceKe == '0') return false;
      const d = new Date();
      moment.locale('id');
      this.kop.tgl = moment(this.date).format('Do MMMM YYYY');
      this.kop.jthTempo = moment(this.date1).format('Do MMMM YYYY');

      const columns = [
        { title: "No.", dataKey: "no" },
        { title: "QTY", dataKey: "qtyTampil" },
        { title: "Satuan", dataKey: "satuan" },
        { title: "Keterangan", dataKey: "description" },
        { title: "Harga", dataKey: "unitPriceTampil" },
        { title: "Subtotal", dataKey: "amountTampil" },
      ];
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "cm",
        format: "a4"//letter"
      });
      // text is placed using x, y coordinates
      doc.setFontSize(14).setFontStyle("bold").setTextColor(6, 106, 156).text('TOKO PLASTIK SAYA', 1.5, 1.5);
      doc.setFontSize(12).setFontStyle("normal").setTextColor(0, 0, 0).text('PASURUAN \nTELP. '+this.kop.teleponToko, 1.5, 2.0);
      doc.setFontSize(14).setFontStyle("bold").text('INVOICE', 16.0, 1.5);
      doc.setFontSize(12).setFontStyle("bold").text(`KEPADA YTH.`, 1.5, 3.5);
      doc.setFontSize(12).setFontStyle("normal").text(`\n${this.kop.nama.toString().toUpperCase()}\n${this.kapitalisasiKata(this.kop.alamat)}\n${this.kop.telepon}`, 1.5, 3.5);

      doc.setFontSize(12).setFontStyle("bold").text(`NO. FAKTUR \nTANGGAL/KIRIM \nTGL. JATUH TEMPO`, 11, 3.5);
      doc.setFontSize(12).setFontStyle("normal").text(`${this.kop.invoiceKe}` + `\n${this.kop.tgl}` + `\n${this.kop.jthTempo}`, 16, 3.5);
      // create a line under heading
      //titik awal garis , posisi tinggi garis , panjang , titik akhir garis
      // doc.setLineWidth(0.01).line(0.5, 0.6, 8.0, 0.6);
      // Using autoTable plugin
      let bodycolom = [];
      for (let i = 0; i < this.keranjangBarang.length; i++) {
        const el = this.keranjangBarang[i];
        const dorong = {
          no: i + 1,
          qtyTampil: el.qtyTampil,
          satuan: el.satuan,
          description: el.description,
          unitPriceTampil: el.unitPriceTampil,
          amountTampil: el.amountTampil
        }
        bodycolom.push(dorong)
      }
      doc.autoTable({
        columns,
        body: bodycolom, //this.keranjangBarang,
        margin: { left: 1.5, top: 6.0 },
        columnStyles: {
          'unitPriceTampil': { halign: "right" },
          'amountTampil': { halign: "right" },
        },

      });
      let ln = (this.keranjangBarang.length * 0.8) + 7.5;
      console.log('ini ln: ', this.keranjangBarang.length);
      doc.text('  Total: ' + this.totalBelanjaString + ',00', 14, ln);
      doc.setFontStyle("normal").text('Terbilang: ' + this.totalBelanjaTerbilang + ' rupiah.', 1.5, ln, { align: "left", maxWidth: "11.5" });

      doc
        .setFontSize(12)
        .setFontStyle('bold')
        .text('PEMBAYARAN DITRANSFER KE                                        TANDA TERIMA', 2.5, ln + 2);
      doc
        .setFontSize(12)
        .setFontStyle('normal')
        .text('BCA. 0890800521 \nBNI. 0346396475 \na.n BAMBANG', 2.5, ln + 2.5);

      /*
      doc.output('save', 'filename.pdf'); //Try to save PDF as a file (not works on ie before 10, and some mobile devices)
      doc.output('datauristring');        //returns the data uri string
      doc.output('datauri');              //opens the data uri in current window
      doc.output('dataurlnewwindow');     //opens the data uri in new window
      */
      doc.output('dataurlnewwindow', `judul.pdf`);
    },
    simpanPdf() {
      console.log('inig kop.tgl :', this.kop.tgl);
      console.log('inig kop.jthTempo :', this.kop.jthTempo);

      if (this.kop.nama == '' || this.kop.invoiceKe == '0') return false;
      const d = new Date();
      moment.locale('id');
      this.kop.tgl = moment(this.date).format('Do MMMM YYYY');
      this.kop.jthTempo = moment(this.date1).format('Do MMMM YYYY');

      const columns = [
        { title: "No.", dataKey: "no" },
        { title: "QTY", dataKey: "qtyTampil" },
        { title: "Satuan", dataKey: "satuan" },
        { title: "Keterangan", dataKey: "description" },
        { title: "Harga", dataKey: "unitPriceTampil" },
        { title: "Subtotal", dataKey: "amountTampil" },
      ];
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "cm",
        format: "a4"//letter"
      });
      // text is placed using x, y coordinates
      doc.setFontSize(14).setFontStyle("bold").setTextColor(6, 106, 156).text('TOKO PLASTIK SAYA', 1.5, 1.5);
      doc.setFontSize(12).setFontStyle("normal").setTextColor(0, 0, 0).text('PASURUAN \nTELP. '+this.kop.teleponToko, 1.5, 2.0);
      doc.setFontSize(14).setFontStyle("bold").text('INVOICE', 16.0, 1.5);
      doc.setFontSize(12).setFontStyle("bold").text(`KEPADA YTH.`, 1.5, 3.5);
      doc.setFontSize(12).setFontStyle("normal").text(`\n${this.kop.nama.toString().toUpperCase()}\n${this.kapitalisasiKata(this.kop.alamat)}\n${this.kop.telepon}`, 1.5, 3.5);

      doc.setFontSize(12).setFontStyle("bold").text(`NO. FAKTUR \nTANGGAL/KIRIM \nTGL. JATUH TEMPO`, 11, 3.5);
      doc.setFontSize(12).setFontStyle("normal").text(`${this.kop.invoiceKe}` + `\n${this.kop.tgl}` + `\n${this.kop.jthTempo}`, 16, 3.5);
      // create a line under heading
      //titik awal garis , posisi tinggi garis , panjang , titik akhir garis
      // doc.setLineWidth(0.01).line(0.5, 0.6, 8.0, 0.6);
      // Using autoTable plugin
      let bodycolom = [];
      for (let i = 0; i < this.keranjangBarang.length; i++) {
        const el = this.keranjangBarang[i];
        const dorong = {
          no: i + 1,
          qtyTampil: el.qtyTampil,
          satuan: el.satuan,
          description: el.description,
          unitPriceTampil: el.unitPriceTampil,
          amountTampil: el.amountTampil
        }
        bodycolom.push(dorong)
      }
      doc.autoTable({
        columns,
        body: bodycolom, //this.keranjangBarang,
        margin: { left: 1.5, top: 6.0 },
        columnStyles: {
          'unitPriceTampil': { halign: "right" },
          'amountTampil': { halign: "right" },
        },

      });
      let ln = (this.keranjangBarang.length * 0.8) + 7.5;
      console.log('ini ln: ', this.keranjangBarang.length);
      doc.text('  Total: ' + this.totalBelanjaString + ',00', 14, ln);
      doc.setFontStyle("normal").text('Terbilang: ' + this.totalBelanjaTerbilang + ' rupiah.', 1.5, ln, { align: "left", maxWidth: "11.5" });

      doc
        .setFontSize(12)
        .setFontStyle('bold')
        .text('PEMBAYARAN DITRANSFER KE                                        TANDA TERIMA', 2.5, ln + 2);
      doc
        .setFontSize(12)
        .setFontStyle('normal')
        .text('BCA. 0890800521 \nBNI. 0346396475 \na.n BAMBANG', 2.5, ln + 2.5);
      doc.output('save', `${this.kop.invoiceKe}.pdf`);
    },
    /* Fungsi formatRupiah */
    formatRupiah(angka, prefix) {
      let number_string = angka.replace(/[^,\d]/g, '').toString(),
        split = number_string.split(','),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);

      // tambahkan titik jika yang di input sudah menjadi angka ribuan
      if (ribuan) {
        separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
      }

      rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
      return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
    },
    formatAngka(angka) {
      let number_string = angka.replace(/[^,\d]/g, '').toString(),
        split = number_string.split(','),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);

      // tambahkan titik jika yang di input sudah menjadi angka ribuan
      if (ribuan) {
        separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
      }

      rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
      return rupiah;
    },
    terbilang(nilai) {
      nilai = Math.abs(nilai);
      let simpanNilaiBagi = 0;
      const huruf = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
      let temp = "";

      if (nilai < 12) {
        temp = " " + huruf[nilai];
      }
      else if (nilai < 20) {
        temp = this.terbilang(nilai - 10) + " Belas";
      }
      else if (nilai < 100) {
        simpanNilaiBagi = Math.floor(nilai / 10);
        temp = this.terbilang(simpanNilaiBagi) + " Puluh" + this.terbilang(nilai % 10);
      }
      else if (nilai < 200) {
        temp = " Seratus" + this.terbilang(nilai - 100);
      }
      else if (nilai < 1000) {
        simpanNilaiBagi = Math.floor(nilai / 100);
        temp = this.terbilang(simpanNilaiBagi) + " Ratus" + this.terbilang(nilai % 100);
      }
      else if (nilai < 2000) {
        temp = " Seribu" + this.terbilang(nilai - 1000);
      }
      else if (nilai < 1000000) {
        simpanNilaiBagi = Math.floor(nilai / 1000);
        temp = this.terbilang(simpanNilaiBagi) + " Ribu" + this.terbilang(nilai % 1000);
      }
      else if (nilai < 1000000000) {
        simpanNilaiBagi = Math.floor(nilai / 1000000);
        temp = this.terbilang(simpanNilaiBagi) + " Juta" + this.terbilang(nilai % 1000000);
      }
      else if (nilai < 1000000000000) {
        simpanNilaiBagi = Math.floor(nilai / 1000000000);
        temp = this.terbilang(simpanNilaiBagi) + " Miliar" + this.terbilang(nilai % 1000000000);
      }
      else if (nilai < 1000000000000000) {
        simpanNilaiBagi = Math.floor(nilai / 1000000000000);
        temp = this.terbilang(nilai / 1000000000000) + " Triliun" + this.terbilang(nilai % 1000000000000);
      }

      return temp;
    },

  }
})
