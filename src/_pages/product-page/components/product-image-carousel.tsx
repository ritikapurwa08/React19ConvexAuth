import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductImageCarouselProps {
  images: (string | null)[] | undefined;
  name?: string;
}

const ProductImageCarousel = ({
  images,
  name = "Product",
}: ProductImageCarouselProps) => {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden h-full">
      {images.length > 1 ? (
        <Carousel className="w-full h-full relative">
          <CarouselContent className="h-full">
            {images.map((imageUrl, index) => (
              <CarouselItem key={index} className="h-full">
                <div className="relative w-full h-full  aspect-square">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={`${name} ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="absolute top-1/2 left-2 bg-black/50 text-white size-10 " />
          <CarouselNext className="absolute top-1/2 right-2 bg-black/50 text-white size-10" />
        </Carousel>
      ) : (
        <div className="relative w-full h-full min-h-[200px] aspect-square">
          {images[0] && (
            <img
              src={images[0]}
              alt={`Product ${name}`}
              className="w-full h-full object-cover rounded-lg"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ProductImageCarousel;
