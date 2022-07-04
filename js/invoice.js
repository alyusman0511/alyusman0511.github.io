new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: {
    kop: {
      nama: null,
      alamat: null,
      invoiceKe: 0,
      tgl: null,
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
    totalTerbilang: null,
    dialogEdit: false,
  },
  mounted() {
    this.$refs.refKopNama.focus()
    this.totalTerbilang = this.terbilang(parseInt(this.totalBelanjaAngka));
  },

  methods: {
    addKeranjang() {
      if (this.add.qty == '' || this.add.unitPrice == '' || this.add.satuan == '') return false;
      const qq = this.add.qty
      const ss = this.add.satuan
      const uu = this.add.unitPrice
      const a = this.add.qty * this.add.unitPrice

      const dorong = {
        no: this.add.no + 1,
        qty: qq,
        satuan: ss,
        qtyTampil: this.formatAngka(qq.toString()),
        description: this.add.description,
        unitPrice: this.add.unitPrice,
        unitPriceTampil: this.formatAngka(uu.toString()),
        amount: this.add.qty * this.add.unitPrice,
        amountTampil: this.formatAngka(a.toString()),
      }
      this.keranjangBarang.push(dorong);
      this.totalFinal();
      this.kosongForm();
      this.$refs.refNamaBarang.focus();
      //ini update saya
      console.log('ini terbilang : ', this.terbilang(parseInt(this.totalBelanja)));
    },
    kosongForm() {
      this.add.qty = null
      this.add.description = null
      this.add.unitPrice = null
    },
    totalFinal() {
      this.totalBelanja = 0;
      for (let i = 0; i < this.keranjangBarang.length; i++) {
        const element = this.keranjangBarang[i];
        this.totalBelanjaAngka += parseInt(element.amount)
        console.log('total ' + this.totalBelanjaAngka);
      }
      this.totalBelanjaString = this.formatRupiah(this.totalBelanjaAngka.toString(), 'Rp.');
      console.log(this.totalBelanja);
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
    simpanPdf() {
      
      if (this.kop.nama == '' || this.kop.invoiceKe == '0') return false;
      const d = new Date();
      const th = d.getFullYear();
      const bl = d.getMonth().toString();
      const bbl = (bl.length < 2) ? '0' + bl : bl;
      const tg = d.getDay().toString();
      const ttg = (tg.length < 2) ? '0' + tg : tg;
      this.kop.tgl = th + '/' + bbl + '/' + ttg;

      const columns = [
        { title: "QTY", dataKey: "qtyTampil" },
        { title: "Satuan", dataKey: "satuan" },
        { title: "Keterangan", dataKey: "description" },
        { title: "Harga", dataKey: "unitPriceTampil" },
        { title: "Subtotal", dataKey: "amountTampil" }
      ];
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "cm",
        format: "a4"//letter"
      });
      // text is placed using x, y coordinates
      doc.setFontSize(14).setFontStyle("bold").text('TOKO PLASTIK SAYA', 1.5, 1.5);
      doc.setFontSize(12).setFontStyle("normal").text('PASURUAN \n(+62)81336554778', 1.5, 2.5);
      doc.setFontSize(14).setFontStyle("bold").text('FAKTUR', 17.5, 1.5);
      doc.setFontSize(12).setFontStyle("bold").text(`Yth. Pelanggan`, 1.5, 4.5);
      doc.setFontSize(12).setFontStyle("normal").text(`\n${this.kop.nama}\n${this.kop.alamat}`, 1.5, 4.5);

      doc.setFontSize(12).setFontStyle("bold").text(`No. Faktur \nTanggal Faktur`, 12, 4.5);
      doc.setFontSize(12).setFontStyle("normal").text(`${this.kop.invoiceKe}` + `\n${this.kop.tgl}`, 17, 4.5);
      // create a line under heading
      //titik awal garis , posisi tinggi garis , panjang , titik akhir garis
      // doc.setLineWidth(0.01).line(0.5, 0.6, 8.0, 0.6);
      // Using autoTable plugin
      doc.autoTable({
        columns,
        body: this.keranjangBarang,
        margin: { left: 1.5, top: 7.0 }
      });
      let ln = (this.keranjangBarang.length * 0.8) + 8.3;
      console.log('ini ln: ', this.keranjangBarang.length);
      doc.text(' || Total : ' + this.totalBelanjaString, 14, ln);
      doc.text('Terbilang: '+this.terbilang(this.totalBelanjaAngka), 1.5, ln, { align: "left", maxWidth: "11.5" });
      // Using array of sentences
      /* doc
         .setFont("helvetica")
         .setFontSize(12)
         .text(this.moreText, 0.5, 3.5, { align: "left", maxWidth: "7.5" });
       
      // Creating footer and saving file
      doc
        .setFont("times")
        .setFontSize(11)
        .setFontStyle("italic")
        .setTextColor(0, 0, 255)
        .text(
          "This is a simple footer located .5 inches from page bottom",
          0.5,
          doc.internal.pageSize.height - 0.5
        ); */
      /*
doc.output('save', 'filename.pdf'); //Try to save PDF as a file (not works on ie before 10, and some mobile devices)
doc.output('datauristring');        //returns the data uri string
doc.output('datauri');              //opens the data uri in current window
doc.output('dataurlnewwindow');     //opens the data uri in new window
*/
      //.save(`${this.heading}.pdf`);
      doc.output('dataurlnewwindow', `judul.pdf`);
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
    terbilang(nilai){
        nilai = Math.abs(nilai);
        let simpanNilaiBagi=0;
        const huruf = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
        let temp="";
     
        if (nilai < 12) {
            temp = " "+huruf[nilai];
        }
        else if (nilai <20) {
            temp = terbilang(nilai - 10) + " Belas";
        }
        else if (nilai < 100) {
            simpanNilaiBagi = Math.floor(nilai/10);
            temp = terbilang(simpanNilaiBagi)+" Puluh"+ terbilang(nilai % 10);
        }
        else if (nilai < 200) {
            temp = " Seratus" + terbilang(nilai - 100);
        }
        else if (nilai < 1000) {
            simpanNilaiBagi = Math.floor(nilai/100);
            temp = terbilang(simpanNilaiBagi) + " Ratus" + terbilang(nilai % 100);
        }
         else if (nilai < 2000) {
            temp = " Seribu" + terbilang(nilai - 1000);
        }
        else if (nilai < 1000000) {
            simpanNilaiBagi = Math.floor(nilai/1000);
            temp = terbilang(simpanNilaiBagi) + " Ribu" + terbilang(nilai % 1000);
        } 
        else if (nilai < 1000000000) {
            simpanNilaiBagi = Math.floor(nilai/1000000);
            temp =terbilang(simpanNilaiBagi) + " Juta" + terbilang(nilai % 1000000);
        } 
        else if (nilai < 1000000000000) {
            simpanNilaiBagi = Math.floor(nilai/1000000000);
            temp = terbilang(simpanNilaiBagi) + " Miliar" + terbilang(nilai % 1000000000);
        } 
        else if (nilai < 1000000000000000) {
            simpanNilaiBagi = Math.floor(nilai/1000000000000);
            temp = terbilang(nilai/1000000000000) + " Triliun" + terbilang(nilai % 1000000000000);
        }
     
        return temp;
    }

  }
})
