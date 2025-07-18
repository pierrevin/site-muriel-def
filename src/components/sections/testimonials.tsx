
"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "../ui/skeleton";

const TestimonialsSection = ({ content }: { content: any }) => {

  if (!content || !content.items) {
    return (
        <section id="testimonials" className="bg-muted section-padding">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <Skeleton className="h-12 w-1/2 mx-auto" />
                </div>
                <div className="max-w-4xl mx-auto">
                    <Skeleton className="h-56 w-full rounded-xl" />
                </div>
            </div>
        </section>
    );
  }
  
  return (
    <section id="testimonials" className="bg-muted section-padding">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-foreground">{content.title}</h2>
        </div>
        <Carousel className="w-full max-w-4xl mx-auto" opts={{ loop: true }}>
          <CarouselContent>
            {content.items.map((testimonial: any, index: number) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card className="bg-card/50 border-border shadow-lg rounded-xl">
                    <CardContent className="flex flex-col items-center justify-center p-8 md:p-12 text-center">
                      <p className="text-lg md:text-xl font-medium text-foreground/90 leading-relaxed">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>
                      <footer className="mt-6">
                        <p className="font-semibold text-secondary">
                          {testimonial.author}
                        </p>
                        <p className="text-sm text-foreground/70">
                          {testimonial.company}
                        </p>
                      </footer>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:inline-flex bg-card/50 hover:bg-card" />
          <CarouselNext className="hidden sm:inline-flex bg-card/50 hover:bg-card" />
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;
