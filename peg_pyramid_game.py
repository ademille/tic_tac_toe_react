"A module to solve the triangle IQ tester game"
class Move(object):
    """ Class to capture information a bout a move"""
    def __init__(self, name, is_valid_func, invert_func):
        self.name = name
        self.is_valid_func = is_valid_func
        self.invert_func = invert_func


class Motions(object):
    "Enumeration for the various types"
    UpLeft, UpRight, DownLeft, DownRight, Left, Right = range(6)

TEST_BOARD_1 = [
    [1],
    [1, 1],
    [1, 0, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1, 1]
]

TEST_BOARD_2 = [
    [1],
    [1, 1],
    [1, 1, 1],
    [1, 1, 1, 1],
    [1, 0, 1, 1, 1]
]


def print_board(board):
    "Print the board out"
    for row in board:
        print(' ' * (len(board) - len(row))),
        print row


def can_move_up_left(board, row, col):
    "Return true if can move up and left"
    return (row - 2 >= 0 and col - 2 >= 0 and
            board[row - 1][col - 1] == 1 and board[row - 2][col - 2] == 0)


def invert_up_left(board, row, col):
    "Invert to allow the command to be undone as well"
    invert(board, row, col)
    invert(board, row - 1, col - 1)
    invert(board, row - 2, col - 2)


def can_move_down_right(board, row, col):
    "Return true if can move down and right"
    return (row + 2 < len(board) and col + 2 < len(board) and
            board[row + 1][col + 1] == 1 and board[row + 2][col + 2] == 0)


def invert_down_right(board, row, col):
    "Invert to allow the command to be undone as well"
    invert(board, row, col)
    invert(board, row + 1, col + 1)
    invert(board, row + 2, col + 2)


def can_move_up_right(board, row, col):
    "Return true if can move up and right"
    return (row - 2 >= 0 and col < len(board[row - 2]) and
            board[row - 1][col] == 1 and board[row - 2][col] == 0)


def invert_up_right(board, row, col):
    "Invert to allow the command to be undone as well"
    invert(board, row, col)
    invert(board, row - 1, col)
    invert(board, row - 2, col)


def can_move_down_left(board, row, col):
    "Return true if can move down and left"
    return (row + 2 < len(board) and
            board[row + 1][col] == 1 and board[row + 2][col] == 0)


def invert_down_left(board, row, col):
    "Invert to allow the command to be undone as well"
    invert(board, row, col)
    invert(board, row + 1, col)
    invert(board, row + 2, col)


def can_move_left(board, row, col):
    "Return true if can move left"
    # Make sure there is a valid place to move
    return (col - 2 >= 0 and
            board[row][col - 1] == 1 and
            board[row][col - 2] == 0)


def invert_left(board, row, col):
    "Invert to allow the command to be undone as well"
    invert(board, row, col)
    invert(board, row, col - 1)
    invert(board, row, col - 2)


def can_move_right(board, row, col):
    "Return true if can move right"
    return (col + 2 < len(board[row]) and
            board[row][col + 1] == 1 and
            board[row][col + 2] == 0)


def invert_right(board, row, col):
    "Invert to allow the command to be undone as well"
    # Move the piece
    invert(board, row, col)
    invert(board, row, col + 1)
    invert(board, row, col + 2)


def invert(board, row, col):
    "Swap zero for one"
    if board[row][col] == 0:
        board[row][col] = 1
    else:
        board[row][col] = 0


def pegs_left_on_board(board):
    "Return the number of pegs left on the board"
    count = 0
    for row in board:
        for val in row:
            count = count + val
    return count


def can_move(board, move_list):
    "Return true if there are any possible moves left"
    for row in range(0, len(board)):
        for col in range(0, len(board[row])):
            # Check if there is a pin at the current position. It could
            # possibly move.
            if board[row][col] == 1:
                # Check if any of the moves are valid
                for move in move_list:
                    if move.is_valid_func(board, row, col):
                        return True
    return False


def print_move(board, row, col, move):
    "Print out a move"
    print
    print "[%d,%d] %s" % (row + 1, col + 1, move)
    print_board(board)


def eight_left_solution(board, move_list):
    "A solution that looks for 8 pegs to be left and no available moves"
    if pegs_left_on_board(board) == 8 and not can_move(board, move_list):
        return True


def three_left_solution(board, move_list):
    "A solution that looks for 3 pegs to be left and no available moves"
    if pegs_left_on_board(board) == 3 and not can_move(board, move_list):
        return True


def one_left_solution(board, move_list):
    "A solution that looks for 1 pegs to be left"
    if pegs_left_on_board(board) == 1:
        return True

# Return a solved board and the list of moves to solve it


def solve(board, test_solution, move_list):
    "Recursively solve the puzzle."
    # Check to see if we have won
    # if pegs_left_on_board(board) == 1:
    if test_solution(board, move_list):
        print "Board solved!"
        print_board(board)
        return True
    else:
        # Iterate through each position trying to solve the puzzle
        for row in range(0, len(board)):
            for col in range(0, len(board[row])):
                # Check if there is a pin at the current position. It could
                # possibly move.
                if board[row][col] == 1:
                    # Try each move to see if it leads to a win
                    for move in move_list:
                        if move.is_valid_func(board, row, col):
                            # Inverting the pegs performs the move
                            move.invert_func(board, row, col)
                            if solve(board, test_solution, move_list):
                                # Undo move so board can be printed
                                # Inverting the pegs again, undoes the move
                                move.invert_func(board, row, col)
                                print_move(board, row, col, move.name)
                                return True
                            else:
                                # Undo move
                                move.invert_func(board, row, col)

        return False


def main():
    "Main function"
    # Setup bossible moves
    move_list = []
    move_list.append(Move("move_left", can_move_left, invert_left))
    move_list.append(Move("move_right", can_move_right, invert_right))
    move_list.append(Move("move_up_left", can_move_up_left, invert_up_left))
    move_list.append(
        Move("move_down_right", can_move_down_right, invert_down_right))
    move_list.append(Move("move_up_right", can_move_up_right, invert_up_right))
    move_list.append(
        Move("move_down_left", can_move_down_left, invert_down_left))

    # Choose the board tos solve
    board = TEST_BOARD_2

    print "Solving"
    # Print the board
    print_board(board)
    if solve(board, eight_left_solution, move_list):
        print "Solution Found!"
    else:
        print "No Solution Found"

    if solve(board, three_left_solution, move_list):
        print "Solution Found!"
    else:
        print "No Solution Found"

    if solve(board, one_left_solution, move_list):
        print "Solution Found!"
    else:
        print "No Solution Found"


if __name__ == "__main__":
    main()
