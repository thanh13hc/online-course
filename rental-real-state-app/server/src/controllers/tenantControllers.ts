import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";

const prisma = new PrismaClient();

export const getTenant = async (req: Request, res: Response): Promise<void> => {
  try {
    const cognitoId = req.params.cognitoId as string;
    const tenant = await prisma.tenant.findUnique({
      where: { cognitoId },
      include: {
        favorites: true,
      },
    });
    if (tenant) {
      res.json(tenant);
    } else {
      res.status(404).json({ message: "Tenant not found" });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving tenant: ${error.message}` });
  }
};

export const createTenant = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { cognitoId, name, email, phoneNumber } = req.body;
    const tenant = await prisma.tenant.create({
      data: {
        cognitoId,
        name,
        email,
        phoneNumber,
      },
    });

    res.status(201).json(tenant);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating tenant: ${error.message}` });
  }
};

export const updateTenant = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const cognitoId = req.params.cognitoId as string;
    const { name, email, phoneNumber } = req.body;
    const updateTenant = await prisma.tenant.update({
      where: {
        cognitoId,
      },
      data: {
        name,
        email,
        phoneNumber,
      },
    });

    res.json(updateTenant);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating tenant: ${error.message}` });
  }
};

export const getCurrentResidences = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const cognitoId = req.params.cognitoId as string;

    const properties = await prisma.property.findMany({
      where: {
        tenants: {
          some: { cognitoId },
        },
      },
      include: {
        location: true,
      },
    });

    const residencesWithFormattedLocation = await Promise.all(
      properties.map(async (propertie) => {
        const coordinates: { coordinates: string }[] =
          await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${propertie.location.id}`;

        const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
        const longtitude = geoJSON.coordinates[0];
        const latitude = geoJSON.coordinates[1];

        return {
          ...propertie,
          location: {
            ...propertie.location,
            coordinates: {
              latitude,
              longtitude,
            },
          },
        };
      }),
    );

    res.json(residencesWithFormattedLocation);
  } catch (error: any) {
    res.status(500).json({
      message: `Error retrieving residences: ${error.message}`,
    });
  }
};

export const addFavoriteProperty = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { cognitoId, propertyId } = req.params;
    const cognitoIdStr = String(cognitoId);
    const tenant = await prisma.tenant.findUnique({
      where: { cognitoId: cognitoIdStr },
      include: { favorites: true },
    });

    const propertyIdNumber = Number(propertyId);
    const existingFavorites = tenant?.favorites || [];

    if (!existingFavorites.some((fav) => fav.id === propertyIdNumber)) {
      const updatedTenant = await prisma.tenant.update({
        where: { cognitoId: cognitoIdStr },
        data: {
          favorites: {
            connect: {
              id: propertyIdNumber,
            },
          },
        },
        include: {
          favorites: true,
        },
      });
      res.json(updatedTenant);
    } else {
      res.status(409).json({ message: "Property already added as favorite" });
    }
  } catch (error: any) {
    res.status(500).json({
      message: `Error add favorite property: ${error.message}`,
    });
  }
};

export const removeFavoriteProperty = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { cognitoId, propertyId } = req.params;
    const cognitoIdStr = String(cognitoId);
    const propertyIdNumber = Number(propertyId);

    const updatedTenant = await prisma.tenant.update({
      where: { cognitoId: cognitoIdStr },
      data: {
        favorites: {
          disconnect: {
            id: propertyIdNumber,
          },
        },
      },
      include: {
        favorites: true,
      },
    });

    res.json(updatedTenant);
  } catch (error: any) {
    res.status(500).json({
      message: `Error remove favorite property: ${error.message}`,
    });
  }
};
