import Card from "@/components/Card";
import CardCompact from "@/components/CompactCard";
import {
  useAddFavoritePropertyMutation,
  useGetAuthUserQuery,
  useGetPropertiesQuery,
  useGetTenantQuery,
  useRemoveFavoritePropertyMutation,
} from "@/state/api";
import { useAppSelector } from "@/state/redux";
import { Property } from "@/types/prismaTypes";
import React from "react";

function Listing() {
  const { data: authUser } = useGetAuthUserQuery();
  const { data: tenant } = useGetTenantQuery(
    authUser?.cognitoInfo.userId || "",
    { skip: !authUser?.cognitoInfo.userId },
  );
  const [addFavorite] = useAddFavoritePropertyMutation();
  const [removeFavorite] = useRemoveFavoritePropertyMutation();
  const viewMode = useAppSelector((state) => state.global.viewMode);
  const filters = useAppSelector((state) => state.global.filters);

  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);

  const handleFavoriteToggle = async (propertyId: number) => {
    if (!authUser) return;

    const isFavorite = tenant.favorites.some(
      (fav: Property) => fav.id === propertyId,
    );

    const fn = isFavorite ? removeFavorite : addFavorite;

    await fn({ cognitoId: authUser.cognitoInfo.userId, propertyId });
  };

  if (isLoading) return <>Loading...</>;
  if (isError || !properties) return <div>Failed to fetch properties</div>;

  return (
    <div className="w-full">
      <h3 className="text-sm px-4 font-bold">
        {properties.length}{" "}
        <span className="text-gray-700 font-normal">
          Places in {filters.location}
        </span>
      </h3>

      <div className="flex">
        <div className="p-4 w-full">
          {properties.map((property) => {
            const Component = viewMode === "grid" ? Card : CardCompact;

            return (
              <Component
                property={property}
                key={property.id}
                isFavorite={
                  tenant?.favorites.some(
                    (fav: Property) => fav.id === property.id,
                  ) || false
                }
                showFavoriteButton={!!authUser}
                propertyLink={`/search/${property.id}`}
                onFavoriteToggle={handleFavoriteToggle.bind(null, property.id)}
              />
            );
          })}
        </div>{" "}
      </div>
    </div>
  );
}

export default Listing;
