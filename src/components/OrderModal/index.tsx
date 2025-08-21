import { Actions, ModalBody, OrderDetails, Overlay } from "./styles"
import closeIcon from '../../assets/images/close-icon.svg'
import type { Order } from "../../types/Order";
import { formatCurrency } from "../../utils/formatCurrency";

interface OrderModalProps {
  visible: boolean;
  order: Order | null;
  onClose: () => void;
  onCancelOrder: () => Promise<void>;
  onChangeOrderStatus: () => Promise<void>;
  isLoading: boolean;
}

export function OrderModal(
  {
    visible,
    order,
    onClose,
    onCancelOrder,
    onChangeOrderStatus,
    isLoading
  }: OrderModalProps
) {

  if (!visible || !order) return null

  const total = order.products.reduce((acc, { product, quantity }) => {
    return acc + (product.price * quantity);
  }, 0)

  return (
    <Overlay>
      <ModalBody>
          <header>
            <strong>Mesa {order.table}</strong>
            <button type="button">
              <img
                src={closeIcon}
                alt="Icone de fechar"
                onClick={onClose}
              />
            </button>
          </header>

          <div className="status-container">
            <small>Status do pedido</small>
            <div>
              <span>
                {order.status === 'WAITING' && '🕓' }
                {order.status === 'IN_PRODUCTION' && '👨‍🍳' }
                {order.status === 'DONE' && '✅' }
              </span>
              <strong>
                {order.status === 'WAITING' && 'Fila de espera' }
                {order.status === 'IN_PRODUCTION' && 'Em produção' }
                {order.status === 'DONE' && 'Pronto!' }
              </strong>
            </div>
          </div>

          <OrderDetails>
            <strong>Itens</strong>

            <div className="order-items">
              {
                order.products.map(({_id, product, quantity}) => (
                  <div className="item" key={_id}>
                    <img
                      src={`http://localhost:3001/uploads/${product.imagePath}`}
                      alt={product.name}
                      width={56}
                      height={28.51}
                    />

                    <span className="quantity">
                      {quantity}x
                    </span>

                    <div className="product-details">
                      <strong>{product.name}</strong>
                      <span>{formatCurrency(product.price)}</span>
                    </div>
                  </div>
                ))
              }
            </div>

            <div className="total">
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
          </OrderDetails>

          <Actions>
            {order.status !== 'DONE' && (
              <button type="button" className="primary" disabled={isLoading} onClick={onChangeOrderStatus}>
                <span>
                  {order.status === 'WAITING' && '👨‍🍳'}
                  {order.status === 'IN_PRODUCTION' && '✅'}
                </span>
                <strong>
                  {order.status === 'WAITING' && 'Iniciair Produção'}
                  {order.status === 'IN_PRODUCTION' && 'Concluir Pedido'}
                </strong>
              </button>
            )}

             <button type="button" className="secondary" onClick={onCancelOrder} disabled={isLoading}>
              <strong>Cancelar Pedido</strong>
            </button>
          </Actions>
      </ModalBody>
    </Overlay>
  )
}
