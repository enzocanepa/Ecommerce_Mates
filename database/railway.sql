-- ============================================================
--  Mates Aconcagua — Script para Railway (sin DROP/CREATE DB)
--  Pegá todo esto en el editor de Railway → Database → Data
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id         VARCHAR(36)          PRIMARY KEY,
  email      VARCHAR(255)         NOT NULL UNIQUE,
  password   VARCHAR(255)         NOT NULL,
  name       VARCHAR(100),
  role       ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at DATETIME             DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id               INT           PRIMARY KEY AUTO_INCREMENT,
  name             VARCHAR(200)  NOT NULL,
  description      TEXT,
  full_description TEXT,
  price            DECIMAL(10,2) NOT NULL,
  image            VARCHAR(500),
  category         ENUM('mates','bombillas','yerba','accesorios') NOT NULL,
  stock            INT           DEFAULT 0,
  created_at       DATETIME      DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_images (
  id         INT          PRIMARY KEY AUTO_INCREMENT,
  product_id INT          NOT NULL,
  url        VARCHAR(500) NOT NULL,
  position   INT          DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_variants (
  id         INT          PRIMARY KEY AUTO_INCREMENT,
  product_id INT          NOT NULL,
  name       VARCHAR(100) NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
  id         VARCHAR(36)   PRIMARY KEY,
  user_id    VARCHAR(36)   NOT NULL,
  total      DECIMAL(10,2) NOT NULL,
  status     ENUM('pending','completed','cancelled') DEFAULT 'pending',
  created_at DATETIME      DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id         INT           PRIMARY KEY AUTO_INCREMENT,
  order_id   VARCHAR(36)   NOT NULL,
  product_id INT           NOT NULL,
  quantity   INT           NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS cart (
  id         INT         PRIMARY KEY AUTO_INCREMENT,
  user_id    VARCHAR(36) NOT NULL UNIQUE,
  items      JSON        NOT NULL DEFAULT ('[]'),
  updated_at DATETIME    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
  id         INT              PRIMARY KEY AUTO_INCREMENT,
  product_id INT              NOT NULL,
  user_id    VARCHAR(36)      NOT NULL,
  rating     TINYINT UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT,
  created_at DATETIME         DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_review (product_id, user_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)    REFERENCES users(id)
);

INSERT INTO products (id, name, description, full_description, price, image, category, stock) VALUES
(1,  'Mate Calabaza Tradicional',       'Mate de calabaza curado, ideal para los amantes del mate tradicional.',   'Mate de calabaza curado artesanalmente siguiendo técnicas tradicionales argentinas. Este mate es perfecto para quienes buscan la experiencia auténtica del mate. La calabaza ha sido cuidadosamente seleccionada y curada para garantizar la mejor calidad y durabilidad.',                                            2500.00,  'https://www.campechanaargentina.com.ar/wp-content/uploads/2022/08/mate-calabaza-linea-imperial-002.jpg',                                              'mates',      15),
(2,  'Mate de Madera Premium',           'Mate de madera de algarrobo con detalles artesanales.',                   'Mate premium tallado en madera de algarrobo, con detalles artesanales únicos. Cada pieza es trabajada a mano por artesanos especializados. La madera de algarrobo es conocida por su durabilidad y resistencia, además de aportar un sabor especial al mate.',                                                  3200.00,  'https://acdn-us.mitiendanube.com/stores/003/652/428/products/diseno-sin-titulo-8-21502ca8044fa714a817449258711144-480-0.webp',                        'mates',      8),
(3,  'Mate Cerámico Artesanal',          'Hermoso mate de cerámica hecho a mano con diseños únicos.',               'Mate de cerámica artesanal con diseños pintados a mano. Cada mate es una obra de arte única, creada por ceramistas argentinos con años de experiencia. La cerámica de alta calidad garantiza durabilidad y resistencia térmica.',                                                                                   2800.00,  'https://d22fxaf9t8d39k.cloudfront.net/442b4da08d4a774b3c5e9f13caa7bc3f2afa1a6b1ff390049c5d01a0d6f0b1b344056.jpg',                                    'mates',      12),
(4,  'Bombilla de Alpaca',               'Bombilla de alpaca con filtro desmontable, fácil de limpiar.',            'Bombilla de alpaca de alta calidad con diseño elegante y funcional. Cuenta con filtro desmontable tipo pico de loro que facilita la limpieza y evita el paso de la yerba. La alpaca es un material tradicional que no altera el sabor del mate.',                                                                1500.00,  'https://arandu.com.ar/wp-content/uploads/2020/06/30160A.jpg',                                                                                         'bombillas',  25),
(5,  'Yerba Mate Premium 1kg',           'Yerba mate seleccionada, con palo, sabor suave y equilibrado.',           'Yerba mate premium de 1kg, elaborada con hojas cuidadosamente seleccionadas de plantaciones orgánicas argentinas. Su composición con palo proporciona un sabor suave y equilibrado. Estacionamiento de 12 meses que garantiza un sabor consistente y aromático.',                                          1200.00,  'https://http2.mlstatic.com/D_Q_NP_778983-MLA99443236440_112025-O.webp',                                                                              'yerba',      50),
(6,  'Termo Stanley 1L',                 'Termo de acero inoxidable, mantiene la temperatura por 24 horas.',        'Termo Stanley Classic de 1 litro, fabricado en acero inoxidable de alta calidad con doble pared al vacío. Mantiene las bebidas calientes por hasta 24 horas y frías por hasta 24 horas. Libre de BPA.',                                                                                                        8500.00,  'https://acdn-us.mitiendanube.com/stores/003/652/428/products/3-c27869be870d202b5d17160754528827-1024-1024.webp',                                      'accesorios', 20),
(7,  'Mate Grabado',                     'Mate de calabaza con grabado a elección.',                                 'Mate de calabaza premium con grabado personalizado a elección. El grabado se realiza con técnicas de pirograbado que garantizan durabilidad y precisión en los detalles. Incluye virola y base de alpaca.',                                                                                                       15000.00, 'https://acdn-us.mitiendanube.com/stores/427/841/products/mate-acero-negro-1-73a3e4e7eda0076a0e17630651719047-1024-1024.webp',                         'mates',      5),
(8,  'Tapa-Mate',                        'Tapa-Mate de silicona.',                                                   'Tapa para mate de silicona de grado alimenticio, flexible y durable. Diseñada para adaptarse a diferentes tamaños de mate, protege tu yerba del polvo y mantiene su frescura.',                                                                                                                                2200.00,  'https://m.media-amazon.com/images/I/51HJr0S0X0L.jpg',                                                                                                'accesorios', 30),
(9,  'Bombilla de Acero Inoxidable',     'Bombilla de acero quirúrgico, resistente y durable.',                     'Bombilla fabricada en acero inoxidable quirúrgico de grado alimenticio, altamente resistente a la corrosión y oxidación. Su filtro en espiral permite un flujo óptimo sin permitir el paso de la yerba más fina.',                                                                                          1800.00,  'https://http2.mlstatic.com/D_NQ_NP_991019-MLA43012367119_082020-O.webp',                                                                             'bombillas',  30),
(10, 'Bombilla Premium Bañada en Plata', 'Bombilla de lujo con baño de plata 925.',                                  'Bombilla de diseño exclusivo bañada en plata 925, perfecta para regalar o coleccionar. Su elaboración combina tradición y elegancia, con detalles ornamentales únicos tallados a mano.',                                                                                                                         3500.00,  'https://http2.mlstatic.com/D_NQ_NP_869514-MLA46516165671_062021-O.webp',                                                                             'bombillas',  10),
(11, 'Bombilla Ecológica de Bambú',      'Bombilla sustentable hecha con bambú natural.',                            'Bombilla ecológica fabricada con bambú 100% natural y biodegradable. El bambú es naturalmente antibacteriano y no altera el sabor. Incluye filtro de acero inoxidable removible.',                                                                                                                           1200.00,  'https://http2.mlstatic.com/D_NQ_NP_665834-MLA49007429114_022022-O.webp',                                                                             'bombillas',  20),
(12, 'Yerba Orgánica Sin Palo 500g',     'Yerba mate orgánica 100% sin palo, sabor intenso.',                       'Yerba mate orgánica certificada, cultivada sin pesticidas ni agroquímicos. Elaboración 100% sin palo para un sabor más intenso. Certificación orgánica internacional con estacionamiento natural de 18 meses.',                                                                                              1500.00,  'https://http2.mlstatic.com/D_NQ_NP_2X_667258-MLA70480464308_072023-F.webp',                                                                          'yerba',      35),
(13, 'Yerba Compuesta con Hierbas',      'Yerba mate con mezcla de hierbas naturales serranas.',                    'Yerba mate compuesta con una selección premium de hierbas serranas: menta, peperina, boldo y cedrón. Aporta propiedades digestivas y un sabor refrescante único.',                                                                                                                                              1350.00,  'https://http2.mlstatic.com/D_NQ_NP_2X_984457-MLA53251425252_012023-F.webp',                                                                          'yerba',      40),
(14, 'Yerba Suave para Principiantes',   'Yerba mate suave, ideal para comenzar en el mundo del mate.',             'Yerba mate especialmente diseñada para quienes recién comienzan a tomar mate. Sabor suave y delicado con mayor proporción de palo que reduce el amargor.',                                                                                                                                                   1100.00,  'https://http2.mlstatic.com/D_NQ_NP_2X_916294-MLU69712256605_052023-F.webp',                                                                          'yerba',      45),
(15, 'Yerba Barbacuá Ahumada 500g',      'Yerba mate con secado tradicional a leña, sabor ahumado.',                'Yerba mate elaborada con el método tradicional de secado barbacuá, que utiliza calor de leña. Este proceso le otorga un sabor ahumado característico y único.',                                                                                                                                               1800.00,  'https://http2.mlstatic.com/D_NQ_NP_2X_635896-MLA52890912076_122022-F.webp',                                                                          'yerba',      15);

INSERT INTO product_variants (product_id, name) VALUES
(1,'Natural'),(1,'Con virola de alpaca'),
(2,'Algarrobo natural'),(2,'Algarrobo oscuro'),
(3,'Diseño flores'),(3,'Diseño geométrico'),(3,'Diseño tradicional'),
(4,'15cm'),(4,'18cm'),(4,'20cm'),
(5,'Tradicional con palo'),(5,'Sin palo'),(5,'Con hierbas serranas'),
(6,'Verde'),(6,'Negro'),(6,'Rojo'),
(7,'Diseño tradicional'),(7,'Diseño personalizado'),(7,'Diseño gaucho'),
(8,'Verde'),(8,'Negro'),(8,'Blanco'),(8,'Celeste'),
(9,'Recta'),(9,'Curva'),(9,'Con virola'),
(10,'Lisa'),(10,'Con grabado'),(10,'Con piedras'),
(11,'Natural'),(11,'Barnizada'),
(12,'500g'),(12,'1kg'),
(13,'Menta y boldo'),(13,'Peperina'),(13,'Mix serranas'),
(14,'1kg'),(14,'500g'),
(15,'500g'),(15,'1kg');

INSERT INTO product_images (product_id, url, position) VALUES
(1, 'https://www.campechanaargentina.com.ar/wp-content/uploads/2022/08/mate-calabaza-linea-imperial-002.jpg', 0),
(2, 'https://acdn-us.mitiendanube.com/stores/003/652/428/products/diseno-sin-titulo-8-21502ca8044fa714a817449258711144-480-0.webp', 0),
(3, 'https://d22fxaf9t8d39k.cloudfront.net/442b4da08d4a774b3c5e9f13caa7bc3f2afa1a6b1ff390049c5d01a0d6f0b1b344056.jpg', 0),
(4, 'https://arandu.com.ar/wp-content/uploads/2020/06/30160A.jpg', 0),
(5, 'https://http2.mlstatic.com/D_Q_NP_778983-MLA99443236440_112025-O.webp', 0),
(6, 'https://acdn-us.mitiendanube.com/stores/003/652/428/products/3-c27869be870d202b5d17160754528827-1024-1024.webp', 0),
(7, 'https://acdn-us.mitiendanube.com/stores/427/841/products/mate-acero-negro-1-73a3e4e7eda0076a0e17630651719047-1024-1024.webp', 0),
(8, 'https://m.media-amazon.com/images/I/51HJr0S0X0L.jpg', 0),
(9, 'https://http2.mlstatic.com/D_NQ_NP_991019-MLA43012367119_082020-O.webp', 0),
(10,'https://http2.mlstatic.com/D_NQ_NP_869514-MLA46516165671_062021-O.webp', 0),
(11,'https://http2.mlstatic.com/D_NQ_NP_665834-MLA49007429114_022022-O.webp', 0),
(12,'https://http2.mlstatic.com/D_NQ_NP_2X_667258-MLA70480464308_072023-F.webp', 0),
(13,'https://http2.mlstatic.com/D_NQ_NP_2X_984457-MLA53251425252_012023-F.webp', 0),
(14,'https://http2.mlstatic.com/D_NQ_NP_2X_916294-MLU69712256605_052023-F.webp', 0),
(15,'https://http2.mlstatic.com/D_NQ_NP_2X_635896-MLA52890912076_122022-F.webp', 0);
