import { Product } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Mate Calabaza Tradicional',
    description: 'Mate de calabaza curado, ideal para los amantes del mate tradicional.',
    fullDescription: 'Mate de calabaza curado artesanalmente siguiendo técnicas tradicionales argentinas. Este mate es perfecto para quienes buscan la experiencia auténtica del mate. La calabaza ha sido cuidadosamente seleccionada y curada para garantizar la mejor calidad y durabilidad. Su interior pulido permite un correcto asentamiento de la yerba y mantiene el sabor característico del mate argentino.',
    price: 2500,
    image: 'https://www.campechanaargentina.com.ar/wp-content/uploads/2022/08/mate-calabaza-linea-imperial-002.jpg',
    images: [
      'https://www.campechanaargentina.com.ar/wp-content/uploads/2022/08/mate-calabaza-linea-imperial-002.jpg',
      'https://www.campechanaargentina.com.ar/wp-content/uploads/2022/08/mate-calabaza-linea-imperial-002.jpg'
    ],
    category: 'mates',
    stock: 15,
    variants: ['Natural', 'Con virola de alpaca']
  },
  {
    id: 2,
    name: 'Mate de Madera Premium',
    description: 'Mate de madera de algarrobo con detalles artesanales.',
    fullDescription: 'Mate premium tallado en madera de algarrobo, con detalles artesanales únicos. Cada pieza es trabajada a mano por artesanos especializados, lo que garantiza que tu mate sea único. La madera de algarrobo es conocida por su durabilidad y resistencia, además de aportar un sabor especial al mate. Incluye virola de alpaca y base reforzada.',
    price: 3200,
    image: 'https://acdn-us.mitiendanube.com/stores/003/652/428/products/diseno-sin-titulo-8-21502ca8044fa714a817449258711144-480-0.webp',
    images: [
      'https://acdn-us.mitiendanube.com/stores/003/652/428/products/diseno-sin-titulo-8-21502ca8044fa714a817449258711144-480-0.webp',
      'https://acdn-us.mitiendanube.com/stores/003/652/428/products/diseno-sin-titulo-8-21502ca8044fa714a817449258711144-480-0.webp'
    ],
    category: 'mates',
    stock: 8,
    variants: ['Algarrobo natural', 'Algarrobo oscuro']
  },
  {
    id: 3,
    name: 'Mate Cerámico Artesanal',
    description: 'Hermoso mate de cerámica hecho a mano con diseños únicos.',
    fullDescription: 'Mate de cerámica artesanal con diseños pintados a mano. Cada mate es una obra de arte única, creada por ceramistas argentinos con años de experiencia. La cerámica de alta calidad garantiza durabilidad y resistencia térmica, manteniendo la temperatura ideal para disfrutar del mate. Disponible en diferentes diseños exclusivos que combinan tradición y arte contemporáneo.',
    price: 2800,
    image: 'https://d22fxaf9t8d39k.cloudfront.net/442b4da08d4a774b3c5e9f13caa7bc3f2afa1a6b1ff390049c5d01a0d6f0b1b344056.jpg',
    images: [
      'https://d22fxaf9t8d39k.cloudfront.net/442b4da08d4a774b3c5e9f13caa7bc3f2afa1a6b1ff390049c5d01a0d6f0b1b344056.jpg',
      'https://d22fxaf9t8d39k.cloudfront.net/442b4da08d4a774b3c5e9f13caa7bc3f2afa1a6b1ff390049c5d01a0d6f0b1b344056.jpg'
    ],
    category: 'mates',
    stock: 12,
    variants: ['Diseño flores', 'Diseño geométrico', 'Diseño tradicional']
  },
  {
    id: 4,
    name: 'Bombilla de Alpaca',
    description: 'Bombilla de alpaca con filtro desmontable, fácil de limpiar.',
    fullDescription: 'Bombilla de alpaca de alta calidad con diseño elegante y funcional. Cuenta con filtro desmontable tipo pico de loro que facilita la limpieza y evita el paso de la yerba. La alpaca es un material tradicional que no altera el sabor del mate y proporciona durabilidad excepcional. Su diseño ergonómico permite una cómoda experiencia al tomar mate.',
    price: 1500,
    image: 'https://arandu.com.ar/wp-content/uploads/2020/06/30160A.jpg',
    images: [
      'https://arandu.com.ar/wp-content/uploads/2020/06/30160A.jpg',
      'https://arandu.com.ar/wp-content/uploads/2020/06/30160A.jpg'
    ],
    category: 'bombillas',
    stock: 25,
    variants: ['15cm', '18cm', '20cm']
  },
  {
    id: 9,
    name: 'Bombilla de Acero Inoxidable',
    description: 'Bombilla de acero quirúrgico, resistente y durable.',
    fullDescription: 'Bombilla fabricada en acero inoxidable quirúrgico de grado alimenticio, altamente resistente a la corrosión y oxidación. Su filtro en espiral permite un flujo óptimo sin permitir el paso de la yerba más fina. Fácil de limpiar y mantener, garantiza una experiencia higiénica y duradera. Ideal para uso diario y viajes.',
    price: 1800,
    image: 'https://http2.mlstatic.com/D_NQ_NP_991019-MLA43012367119_082020-O.webp',
    images: [
      'https://http2.mlstatic.com/D_NQ_NP_991019-MLA43012367119_082020-O.webp',
      'https://http2.mlstatic.com/D_NQ_NP_991019-MLA43012367119_082020-O.webp'
    ],
    category: 'bombillas',
    stock: 30,
    variants: ['Recta', 'Curva', 'Con virola']
  },
  {
    id: 10,
    name: 'Bombilla Premium Bañada en Plata',
    description: 'Bombilla de lujo con baño de plata 925.',
    fullDescription: 'Bombilla de diseño exclusivo bañada en plata 925, perfecta para regalar o coleccionar. Su elaboración combina tradición y elegancia, con detalles ornamentales únicos tallados a mano. El filtro de precisión garantiza un mate perfecto mientras disfrutas de una pieza de arte funcional. Viene en estuche premium de terciopelo.',
    price: 3500,
    image: 'https://http2.mlstatic.com/D_NQ_NP_869514-MLA46516165671_062021-O.webp',
    images: [
      'https://http2.mlstatic.com/D_NQ_NP_869514-MLA46516165671_062021-O.webp',
      'https://http2.mlstatic.com/D_NQ_NP_869514-MLA46516165671_062021-O.webp'
    ],
    category: 'bombillas',
    stock: 10,
    variants: ['Lisa', 'Con grabado', 'Con piedras']
  },
  {
    id: 11,
    name: 'Bombilla Ecológica de Bambú',
    description: 'Bombilla sustentable hecha con bambú natural.',
    fullDescription: 'Bombilla ecológica fabricada con bambú 100% natural y biodegradable. Una alternativa sustentable que no compromete la calidad de tu mate. El bambú es naturalmente antibacteriano y no altera el sabor. Incluye filtro de acero inoxidable removible para facilitar la limpieza. Perfecta para quienes buscan opciones amigables con el medio ambiente.',
    price: 1200,
    image: 'https://http2.mlstatic.com/D_NQ_NP_665834-MLA49007429114_022022-O.webp',
    images: [
      'https://http2.mlstatic.com/D_NQ_NP_665834-MLA49007429114_022022-O.webp',
      'https://http2.mlstatic.com/D_NQ_NP_665834-MLA49007429114_022022-O.webp'
    ],
    category: 'bombillas',
    stock: 20,
    variants: ['Natural', 'Barnizada']
  },
  {
    id: 5,
    name: 'Yerba Mate Premium 1kg',
    description: 'Yerba mate seleccionada, con palo, sabor suave y equilibrado.',
    fullDescription: 'Yerba mate premium de 1kg, elaborada con hojas cuidadosamente seleccionadas de plantaciones orgánicas argentinas. Su composición con palo proporciona un sabor suave y equilibrado, ideal tanto para principiantes como para materos experimentados. Estacionamiento de 12 meses que garantiza un sabor consistente y aromático. Sin aditivos ni conservantes.',
    price: 1200,
    image: 'https://http2.mlstatic.com/D_Q_NP_778983-MLA99443236440_112025-O.webp',
    images: [
      'https://http2.mlstatic.com/D_Q_NP_778983-MLA99443236440_112025-O.webp',
      'https://http2.mlstatic.com/D_Q_NP_778983-MLA99443236440_112025-O.webp'
    ],
    category: 'yerba',
    stock: 50,
    variants: ['Tradicional con palo', 'Sin palo', 'Con hierbas serranas']
  },
  {
    id: 12,
    name: 'Yerba Orgánica Sin Palo 500g',
    description: 'Yerba mate orgánica 100% sin palo, sabor intenso.',
    fullDescription: 'Yerba mate orgánica certificada, cultivada sin pesticidas ni agroquímicos. Elaboración 100% sin palo para un sabor más intenso y concentrado. Ideal para materos que prefieren un mate fuerte y amargo. Certificación orgánica internacional. Estacionamiento natural de 18 meses que potencia su aroma y sabor característico.',
    price: 1500,
    image: 'https://http2.mlstatic.com/D_NQ_NP_2X_667258-MLA70480464308_072023-F.webp',
    images: [
      'https://http2.mlstatic.com/D_NQ_NP_2X_667258-MLA70480464308_072023-F.webp',
      'https://http2.mlstatic.com/D_NQ_NP_2X_667258-MLA70480464308_072023-F.webp'
    ],
    category: 'yerba',
    stock: 35,
    variants: ['500g', '1kg']
  },
  {
    id: 13,
    name: 'Yerba Compuesta con Hierbas',
    description: 'Yerba mate con mezcla de hierbas naturales serranas.',
    fullDescription: 'Yerba mate compuesta con una selección premium de hierbas serranas: menta, peperina, boldo y cedrón. Esta mezcla aporta propiedades digestivas y un sabor refrescante único. Perfecta para quienes buscan variar los sabores tradicionales sin perder la esencia del mate argentino. Ingredientes 100% naturales sin saborizantes artificiales.',
    price: 1350,
    image: 'https://http2.mlstatic.com/D_NQ_NP_2X_984457-MLA53251425252_012023-F.webp',
    images: [
      'https://http2.mlstatic.com/D_NQ_NP_2X_984457-MLA53251425252_012023-F.webp',
      'https://http2.mlstatic.com/D_NQ_NP_2X_984457-MLA53251425252_012023-F.webp'
    ],
    category: 'yerba',
    stock: 40,
    variants: ['Menta y boldo', 'Peperina', 'Mix serranas']
  },
  {
    id: 14,
    name: 'Yerba Suave para Principiantes 1kg',
    description: 'Yerba mate suave, ideal para comenzar en el mundo del mate.',
    fullDescription: 'Yerba mate especialmente diseñada para quienes recién comienzan a tomar mate. Sabor suave y delicado, con mayor proporción de palo que reduce el amargor. Molienda media que facilita el cebado y evita que se lave rápidamente. Perfecta para iniciarse en la tradición del mate sin el impacto de sabores muy intensos.',
    price: 1100,
    image: 'https://http2.mlstatic.com/D_NQ_NP_2X_916294-MLU69712256605_052023-F.webp',
    images: [
      'https://http2.mlstatic.com/D_NQ_NP_2X_916294-MLU69712256605_052023-F.webp',
      'https://http2.mlstatic.com/D_NQ_NP_2X_916294-MLU69712256605_052023-F.webp'
    ],
    category: 'yerba',
    stock: 45,
    variants: ['1kg', '500g']
  },
  {
    id: 15,
    name: 'Yerba Barbacuá Ahumada 500g',
    description: 'Yerba mate con secado tradicional a leña, sabor ahumado.',
    fullDescription: 'Yerba mate elaborada con el método tradicional de secado barbacuá, que utiliza calor de leña para secar las hojas. Este proceso ancestral le otorga un sabor ahumado característico y único, muy apreciado por los conocedores. Producción limitada artesanal que mantiene vivas las tradiciones misioneras. Un verdadero tesoro para paladares exigentes.',
    price: 1800,
    image: 'https://http2.mlstatic.com/D_NQ_NP_2X_635896-MLA52890912076_122022-F.webp',
    images: [
      'https://http2.mlstatic.com/D_NQ_NP_2X_635896-MLA52890912076_122022-F.webp',
      'https://http2.mlstatic.com/D_NQ_NP_2X_635896-MLA52890912076_122022-F.webp'
    ],
    category: 'yerba',
    stock: 15,
    variants: ['500g', '1kg']
  },
  {
    id: 6,
    name: 'Termo Stanley 1L',
    description: 'Termo de acero inoxidable, mantiene la temperatura por 24 horas.',
    fullDescription: 'Termo Stanley Classic de 1 litro, fabricado en acero inoxidable de alta calidad con doble pared al vacío. Mantiene las bebidas calientes por hasta 24 horas y frías por hasta 24 horas. Diseño robusto y duradero, ideal para llevar a cualquier lugar. Cuenta con pico cebador y manija ergonómica para facilitar el servicio del mate. Libre de BPA.',
    price: 8500,
    image: 'https://acdn-us.mitiendanube.com/stores/003/652/428/products/3-c27869be870d202b5d17160754528827-1024-1024.webp',
    images: [
      'https://acdn-us.mitiendanube.com/stores/003/652/428/products/3-c27869be870d202b5d17160754528827-1024-1024.webp',
      'https://acdn-us.mitiendanube.com/stores/003/652/428/products/3-c27869be870d202b5d17160754528827-1024-1024.webp'
    ],
    category: 'accesorios',
    stock: 20,
    variants: ['Verde', 'Negro', 'Rojo']
  },
  {
    id: 7,
    name: 'Mate Grabado',
    description: 'Mate de calabaza con grabado a eleccion.',
    fullDescription: 'Mate de calabaza premium con grabado personalizado a elección. Puedes elegir entre diferentes diseños tradicionales argentinos o solicitar un diseño personalizado. El grabado se realiza con técnicas de pirograbado que garantizan durabilidad y precisión en los detalles. Incluye virola y base de alpaca con terminaciones de alta calidad.',
    price: 15000,
    image: 'https://acdn-us.mitiendanube.com/stores/427/841/products/mate-acero-negro-1-73a3e4e7eda0076a0e17630651719047-1024-1024.webp',
    images: [
      'https://acdn-us.mitiendanube.com/stores/427/841/products/mate-acero-negro-1-73a3e4e7eda0076a0e17630651719047-1024-1024.webp',
      'https://acdn-us.mitiendanube.com/stores/427/841/products/mate-acero-negro-1-73a3e4e7eda0076a0e17630651719047-1024-1024.webp'
    ],
    category: 'mates',
    stock: 5,
    variants: ['Diseño tradicional', 'Diseño personalizado', 'Diseño gaucho']
  },
  {
    id: 8,
    name: 'Tapa-Mate',
    description: 'Tapa-Mate de silicona.',
    fullDescription: 'Tapa para mate de silicona de grado alimenticio, flexible y durable. Diseñada para adaptarse a diferentes tamaños de mate, protege tu yerba del polvo y mantiene su frescura. La silicona es resistente a altas temperaturas y fácil de limpiar.',
    price: 2200,
    image: 'https://m.media-amazon.com/images/I/51HJr0S0X0L.jpg',
    images: [
      'https://m.media-amazon.com/images/I/51HJr0S0X0L.jpg',
      'https://m.media-amazon.com/images/I/51HJr0S0X0L.jpg'
    ],
    category: 'accesorios',
    stock: 30,
    variants: ['Verde', 'Negro', 'Blanco', 'Celeste']
  }
];
