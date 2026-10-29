// Código de página (Velo): manda las casas de la base de datos «Casas en venta» a la tarjeta.
// El bloque «Insertar HTML» con la tarjeta debe llamarse #casasVenta (en sus propiedades, campo ID).
// Nota: este código solo corre en «Vista previa» y en el sitio publicado, no dentro del editor.
import wixData from 'wix-data';

let casas = null; // null = todavía no se leen las casas

function enviar() {
  if (casas !== null) $w('#casasVenta').postMessage({ tipo: 'casas', casas });
}

$w.onReady(() => {
  // 1) Primero escuchamos a la tarjeta: cada vez que avisa «listo», le mandamos las casas
  $w('#casasVenta').onMessage((evento) => {
    if (evento.data && evento.data.tipo === 'listo') enviar();
  });

  // 2) Luego leemos la base de datos y mandamos las casas en cuanto llegan
  wixData.query('CasasEnVenta')
    .ne('estado', 'Vendida')
    .ascending('orden')
    .find()
    .then((resultado) => {
      casas = resultado.items.map((c) => ({
        title: c.title,
        estado: c.estado,
        ubicacion: c.ubicacion,
        precio: c.precio,
        medidasTerreno: c.medidasTerreno,
        terrenoM2: c.terrenoM2,
        construccionM2: c.construccionM2,
        recamaras: c.recamaras,
        banos: c.banos,
        estacionamiento: c.estacionamiento,
        descripcion: c.descripcion,
        caracteristicas: c.caracteristicas,
        fotoPrincipal: c.fotoPrincipal,
        galeria: (c.galeria || []).map((g) => ({ src: g.src, title: g.title })),
      }));
      enviar();
    })
    .catch((error) => {
      console.error('No se pudieron leer las casas en venta', error);
    });
});
