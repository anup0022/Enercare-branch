<?php

namespace SearchRegex\Sql\Where;

use SearchRegex\Sql;

/**
 * AND a group of WHERE statements together
 */
class Where_And extends Where_Or {
	public function get_as_sql() {
		return $this->get_group( 'AND' );
	}
}
