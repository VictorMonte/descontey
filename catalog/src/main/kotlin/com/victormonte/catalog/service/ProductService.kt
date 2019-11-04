package com.victormonte.catalog.service

import com.victormonte.catalog.domain.Product
import com.victormonte.catalog.infrastructure.repository.ProductRepository
import discount.Discount
import discount.DiscountServiceGrpc
import io.grpc.ManagedChannelBuilder
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux

@Service
class ProductService(private val productRepository: ProductRepository,
                     private val discountService: DiscountService) {

    fun get(userId: String) : Flux<Product> {

        return productRepository
                .findAll()
                .map {
                    var discount = discountService.get(userId, it.id)
                    Product(
                            it._id,
                            it.id,
                            it.priceInCents,
                            it.title,
                            it.description,
                            com.victormonte.catalog.domain.Discount(discount!!.porcent, discount.valueInCents))
                }

    }
}

@Service
class DiscountService {

    fun get(userId: String, productId: String): Discount.GetDiscountReply? {

        val channel = ManagedChannelBuilder.forAddress("127.0.0.1", 50051)
                .usePlaintext()
                .build()

        val discountServiceGrpc = DiscountServiceGrpc.newBlockingStub(channel)

        val request = Discount.GetDiscountRequest
                .newBuilder()
                .setUserId(userId)
                .setProductId(productId)
                .build()

        return discountServiceGrpc.get(request)
    }
}
