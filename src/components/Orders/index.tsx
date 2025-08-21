import { useEffect, useState } from "react";
import socketIo from 'socket.io-client';

import { OrdersBoard } from "../OrdersBoard";
import { Container} from "./styles";
import type { Order } from "../../types/Order";
import { api } from "../../utils/api";

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const socket = socketIo('http://localhost:3001', {
      transports: ['websocket'],
    })

    socket.on('orders@new', (order) => {
      setOrders((prevState) => {
        const orderAlreadyExists = prevState.some(
          (prevOrder) => prevOrder._id === order._id
        );

        if (orderAlreadyExists) {
          return prevState;
        }

        return prevState.concat(order);
      });
    })

    return () => {
      socket.off('orders@new');
      socket.disconnect();
    };
  }, [])

  useEffect(() => {
    api.get('/orders')
      .then(({ data }) => {
        setOrders(data);
      })
  }, [])

  const waitingOrders = orders.filter((order) => order.status === 'WAITING')
  const inProductionOrders = orders.filter((order) => order.status === 'IN_PRODUCTION')
  const doneOrders = orders.filter((order) => order.status === 'DONE')

  function handleCancelOrder(orderId: string) {
    setOrders((prevState) => prevState.filter(order => order._id !== orderId))
  }

  function handleOrderStatusChange (orderId: string, status: Order['status']) {
    setOrders((prevState) => prevState.map((order) => (
      order._id === orderId
        ? { ...order, status }
        : order
    )))
  }

  return (
    <Container>
      <OrdersBoard
        icon="🕒"
        title="Fila de espera"
        orders={waitingOrders}
        onCancelOrder={handleCancelOrder}
        onChangeOrderStatus={handleOrderStatusChange}
      />

      <OrdersBoard
        icon="🧑‍🍳"
        title="Em preparação"
        orders={inProductionOrders}
        onCancelOrder={handleCancelOrder}
        onChangeOrderStatus={handleOrderStatusChange}
      />

      <OrdersBoard
        icon="✅"
        title="Pronto!"
        orders={doneOrders}
        onCancelOrder={handleCancelOrder}
        onChangeOrderStatus={handleOrderStatusChange}
      />
    </Container>
  )
}
