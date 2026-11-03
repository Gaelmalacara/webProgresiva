import { HttpTypes } from "@medusajs/types"
import { Text } from "@modules/common/components/ui"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetails = ({ order }: OrderDetailsProps) => {
  return (
    <div>
      <Text className="text-[#a5a69f]">
        Enviamos la confirmación de tu compra a{" "}
        <span
          className="text-ui-fg-medium-plus font-semibold"
          data-testid="order-email"
        >
          {order.email}
        </span>
        .
      </Text>
      <Text className="mt-2">
        Fecha de compra:{" "}
        <span data-testid="order-date">
          {new Date(order.created_at).toLocaleDateString("es-MX")}
        </span>
      </Text>
      <Text className="mt-2 text-[#b4bd8c]">
        Número de compra: <span data-testid="order-id">{order.display_id}</span>
      </Text>

    </div>
  )
}

export default OrderDetails
