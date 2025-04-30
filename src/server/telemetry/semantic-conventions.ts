/**
 * 自定义OpenTelemetry语义约定常量
 * 基于OpenTelemetry语义约定规范 v1.32.0
 * @see https://opentelemetry.io/docs/specs/semconv/
 */

// HTTP相关属性 (稳定的)
export const ATTR_HTTP_REQUEST_METHOD = 'http.request.method'
export const ATTR_HTTP_ROUTE = 'http.route'
export const ATTR_HTTP_RESPONSE_STATUS_CODE = 'http.response.status_code'
export const ATTR_HTTP_REQUEST_BODY_SIZE = 'http.request.body.size'
export const ATTR_HTTP_RESPONSE_BODY_SIZE = 'http.response.body.size'

// URL相关属性 (替代已弃用的http.url)
export const ATTR_URL_FULL = 'url.full'
export const ATTR_URL_PATH = 'url.path'
export const ATTR_URL_QUERY = 'url.query'
export const ATTR_URL_SCHEME = 'url.scheme'

// 服务相关属性
export const ATTR_SERVICE_NAME = 'service.name'
export const ATTR_SERVICE_VERSION = 'service.version'
export const ATTR_SERVICE_INSTANCE_ID = 'service.instance.id'

// 数据库相关属性
export const ATTR_DB_SYSTEM = 'db.system'
export const ATTR_DB_NAME = 'db.name'
export const ATTR_DB_STATEMENT = 'db.statement'
export const ATTR_DB_OPERATION = 'db.operation'
export const ATTR_DB_USER = 'db.user'
export const ATTR_DB_COLLECTION_NAME = 'db.collection.name'

// 异常相关属性 (稳定的)
export const ATTR_EXCEPTION_TYPE = 'exception.type'
export const ATTR_EXCEPTION_MESSAGE = 'exception.message'
export const ATTR_EXCEPTION_STACKTRACE = 'exception.stacktrace'

// 用户相关属性
export const ATTR_ENDUSER_ID = 'enduser.id'
export const ATTR_ENDUSER_ROLE = 'enduser.role'

// 网络相关属性
export const ATTR_NETWORK_PROTOCOL_NAME = 'network.protocol.name'
export const ATTR_NETWORK_PROTOCOL_VERSION = 'network.protocol.version'

// 服务器和客户端属性
export const ATTR_SERVER_ADDRESS = 'server.address'
export const ATTR_SERVER_PORT = 'server.port'
export const ATTR_CLIENT_ADDRESS = 'client.address'

// 自定义属性前缀
export const ATTR_APP_PREFIX = 'app.'

// 数据库系统标准值
export const DB_SYSTEM_VALUE_POSTGRESQL = 'postgresql'
export const DB_SYSTEM_VALUE_SQLITE = 'sqlite'
