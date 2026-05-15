export type Categoria = "Bebidas" | "Lanches" | "Pratos";

export const CATEGORIAS: Categoria[] = ["Bebidas", "Lanches", "Pratos"];

export interface PresetImage {
  label: string;
  url: string;
  categoria: Categoria;
}

export const PRESET_IMAGES: PresetImage[] = [
  {
    label: "Hambúrguer",
    categoria: "Lanches",
    url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop",
  },
  {
    label: "Sanduíche",
    categoria: "Lanches",
    url: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=400&fit=crop",
  },
  {
    label: "Batata frita",
    categoria: "Lanches",
    url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop",
  },
  {
    label: "Pizza",
    categoria: "Pratos",
    url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=400&fit=crop",
  },
  {
    label: "Risoto",
    categoria: "Pratos",
    url: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=400&fit=crop",
  },
  {
    label: "Prato executivo",
    categoria: "Pratos",
    url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop",
  },
  {
    label: "Massa",
    categoria: "Pratos",
    url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=400&fit=crop",
  },
  {
    label: "Suco de laranja",
    categoria: "Bebidas",
    url: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=400&fit=crop",
  },
  {
    label: "Suco verde",
    categoria: "Bebidas",
    url: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=400&fit=crop",
  },
  {
    label: "Cerveja",
    categoria: "Bebidas",
    url: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop",
  },
  {
    label: "Refrigerante",
    categoria: "Bebidas",
    url: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=400&fit=crop",
  },
  {
    label: "Café",
    categoria: "Bebidas",
    url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop",
  },
];

export const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop";