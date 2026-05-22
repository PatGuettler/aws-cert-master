# Vendor assets

## jsPDF (certificate PDFs)

`jspdf.umd.min.js` is loaded locally first, then from jsDelivr if missing.

To refresh:

```bash
curl -fsSL -o vendor/jspdf.umd.min.js \
  https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js
```

Note: cdnjs `jspdf/2.5.2` URLs return 404; use jsDelivr or this vendored copy.
