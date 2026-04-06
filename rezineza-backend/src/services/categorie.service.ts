import db from "../lib/db";
import type { CreateCategoryDto, UpdateCategoryDto, PatchCategoryDto } from "@/dtos/categorie.dto";

export async function getAllCategories(search?: string) {
    return db.category.findMany({
        where: search ? { name: { contains: search } } : undefined
    });
}

export async function getCategoryById(id: number) {
  return db.category.findUnique({ where: { id } });
}

export async function createCategory(data: CreateCategoryDto) {
  return db.category.create({
    data: { name: data.name },
  });
}

export async function updateCategory(id: number, data: UpdateCategoryDto) {
  const existing = await db.category.findUnique({ where: { id } });
    if (!existing) return null;
  return db.category.update({
    where: { id },
    data: { name: data.name },
  });
}

export async function patchCategory(id: number, data: PatchCategoryDto) {
  const existing = await db.category.findUnique({ where: { id } });
    if (!existing) return null;
  return db.category.update({ where: { id }, data });
}

export async function deleteCategory(id: number) {
  await db.category.delete({ where: { id } });
  return true;
}