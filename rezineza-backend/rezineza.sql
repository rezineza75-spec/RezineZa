CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) ,
    description TEXT,
    price DECIMAL(10, 2),
    -- nombre décimal avec 10 chiffres max dont 2 après la virgule. Ex: 99.99
    "isAvailable" BOOLEAN NOT NULL DEFAULT TRUE,
    -- si l'article est dispo ou pas
    "categoryId" INT,
    FOREIGN KEY ("categoryId") REFERENCES categories(id)
    -- pour qu'un article ne peut avoir qu'une catégorie qui existe
);


CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    --  entier obligatoire, Le check garantit que la valeur est toujours entre 1 et 5
    comment TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    -- date de creation obiligatoire par défaut la date actuelle est utilisée
    "userId" VARCHAR(255) NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE
    -- on delete cascade signifie que si l'utilisateur est supprimé, tous ses avis sont supprimés automatiquement.
);

CREATE TABLE article_images (
    id SERIAL PRIMARY KEY,
    url VARCHAR(500) NOT NULL,
    "publicId" VARCHAR(255) NOT NULL,
    -- L'identifiant unique de l'image chez Cloudinary. Il est obligatoire car c'est lui qu'on utilise pour supprimer ou modifier l'image sur Cloudinary plus tard.
    "isMain" BOOLEAN NOT NULL DEFAULT FALSE,
    -- indique si c'est l'image principale de l'article (celle affichée en miniature).Un article peut avoir plusieurs images mais une seule principale.
    "articleId" INT NOT NULL,
    FOREIGN KEY ("articleId") REFERENCES articles(id) ON DELETE CASCADE
    --  signifie que si l'article est supprimé, toutes ses images sont supprimées automatiquemen
);
