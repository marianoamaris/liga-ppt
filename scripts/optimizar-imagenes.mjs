#!/usr/bin/env node
/**
 * Genera las versiones ligeras de las imágenes que entran en el bundle.
 *
 * Los originales son PNG de 1620×1620 y entre 450 KB y 2,3 MB cada uno, y se
 * muestran en un recuadro de unos 400 px. El carrusel de Clasificación además
 * las precarga todas de golpe, así que abrir la pantalla en la edición 19 se
 * llevaba 17 MB por delante y 7 MB en la 20 — con datos móviles, la mitad de
 * la jornada.
 *
 * A 800 px y en WebP la misma tarjeta pesa unas cuarenta veces menos y el
 * texto sigue nítido: son gráficos planos, sin transparencia real, que es el
 * caso donde WebP gana por goleada.
 *
 * Los originales se conservan intactos; solo se lee de ellos. Lo que entra en
 * el bundle es la carpeta derivada.
 *
 *   node scripts/optimizar-imagenes.mjs
 */
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import sharp from "sharp";

/**
 * Qué se optimiza y a qué tamaño. El lado sale del hueco donde se pinta cada
 * cosa, con margen para pantallas de doble densidad: no tiene sentido servir
 * 1620 px para un recuadro de 400, ni 1236 para un logo de 208.
 */
const TRABAJOS = [
  { origen: "src/assets/CAMISETAS", destino: "src/assets/CAMISETAS_MIN", lado: 800 },
  { origen: "src/assets/LOGOS", destino: "src/assets/LOGOS_MIN", lado: 480 },
];
const CALIDAD = 82;

/** Todos los .png/.jpg bajo el directorio, con su ruta relativa a la raíz. */
async function fuentes(dir, prefijo = "") {
  const encontradas = [];
  for (const entrada of await readdir(dir, { withFileTypes: true })) {
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) {
      encontradas.push(...(await fuentes(ruta, join(prefijo, entrada.name))));
    } else if (/\.(png|jpe?g)$/i.test(entrada.name)) {
      encontradas.push({ ruta, relativa: join(prefijo, entrada.name) });
    }
  }
  return encontradas;
}

const mb = (b) => `${(b / 1024 / 1024).toFixed(1)} MB`;

for (const { origen, destino, lado } of TRABAJOS) {
  if (!existsSync(origen)) {
    console.log(`(sin ${origen}, se omite)`);
    continue;
  }

  const archivos = await fuentes(origen);
  let generadas = 0;
  let bytesAntes = 0;
  let bytesDespues = 0;

  for (const { ruta, relativa } of archivos) {
    const salida = join(destino, dirname(relativa), `${basename(relativa, extname(relativa))}.webp`);
    await mkdir(dirname(salida), { recursive: true });

    const info = await stat(ruta);
    bytesAntes += info.size;

    // Solo se regenera si falta o si el original es más nuevo, igual que las
    // miniaturas de las fotos de jugadores.
    if (existsSync(salida) && (await stat(salida)).mtimeMs >= info.mtimeMs) {
      bytesDespues += (await stat(salida)).size;
      continue;
    }

    const webp = await sharp(ruta)
      .resize(lado, lado, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: CALIDAD })
      .toBuffer();
    await writeFile(salida, webp);

    bytesDespues += webp.length;
    generadas += 1;
  }

  console.log(
    `${origen}: ${generadas} de ${archivos.length} regeneradas · ` +
      `${mb(bytesAntes)} → ${mb(bytesDespues)}`
  );
}
