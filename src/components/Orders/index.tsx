import type { Order } from "../../types/Order";
import { OrdersBoard } from "../OrdersBoard";
import { Container} from "./styles";

const orders: Order[] = [
 {
		"_id": "68a14fb55c439fdba0d4f046",
		"table": "322",
		"status": "WAITING",
		"products": [
			{
				"product": {
					"name": "Pizza quatro queijos",
					"imagePath": "1755337067619-quatro-queijos.png",
					"price": 40,
				},
				"quantity": 2,
				"_id": "68a14fb55c439fdba0d4f047"
			}
		],
	}
];

export function Orders() {
  return (
    <Container>
      <OrdersBoard icon="🕒" title="Fila de espera" orders={orders}/>
      <OrdersBoard icon="🧑‍🍳" title="Em preparação" orders={[]}/>
      <OrdersBoard icon="✅" title="Pronto!" orders={[]}/>
    </Container>
  )
}
