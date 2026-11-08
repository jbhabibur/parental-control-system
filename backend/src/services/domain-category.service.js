import { prisma } from "../config/database.js";

// ========== Create Domain Category ==========
export const createDomainCategory = async (data) => {
  const existingCategory = await prisma.domainCategory.findFirst({
    where: {
      OR: [{ name: data.name }, { slug: data.slug }],
    },
  });

  if (existingCategory) {
    const error = new Error("Domain category name or slug already exists");
    error.statusCode = 409;
    throw error;
  }

  return prisma.domainCategory.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
    },
  });
};

// ========== Get All Domain Categories ==========
export const getAllDomainCategories = async () => {
  return prisma.domainCategory.findMany({
    include: {
      _count: {
        select: {
          domainRules: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// ========== Get Domain Category by ID ==========
export const getDomainCategoryById = async (categoryId) => {
  const category = await prisma.domainCategory.findUnique({
    where: {
      id: categoryId,
    },
    include: {
      domainRules: true,
    },
  });

  if (!category) {
    const error = new Error("Domain category not found");
    error.statusCode = 404;
    throw error;
  }

  return category;
};

// ========== Update Domain Category ==========
export const updateDomainCategory = async (categoryId, data) => {
  const existingCategory = await prisma.domainCategory.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!existingCategory) {
    const error = new Error("Domain category not found");
    error.statusCode = 404;
    throw error;
  }

  if (data.name || data.slug) {
    const duplicateCategory = await prisma.domainCategory.findFirst({
      where: {
        id: {
          not: categoryId,
        },
        OR: [
          ...(data.name ? [{ name: data.name }] : []),
          ...(data.slug ? [{ slug: data.slug }] : []),
        ],
      },
    });

    if (duplicateCategory) {
      const error = new Error("Domain category name or slug already exists");
      error.statusCode = 409;
      throw error;
    }
  }

  return prisma.domainCategory.update({
    where: {
      id: categoryId,
    },
    data: {
      ...(data.name !== undefined && {
        name: data.name,
      }),
      ...(data.slug !== undefined && {
        slug: data.slug,
      }),
      ...(data.description !== undefined && {
        description: data.description,
      }),
    },
  });
};

// ========== Delete Domain Category ==========
export const deleteDomainCategory = async (categoryId) => {
  const category = await prisma.domainCategory.findUnique({
    where: {
      id: categoryId,
    },
    select: {
      id: true,
    },
  });

  if (!category) {
    const error = new Error("Domain category not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.domainCategory.delete({
    where: {
      id: categoryId,
    },
  });
};
