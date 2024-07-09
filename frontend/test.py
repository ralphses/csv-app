import pandas as pd
import matplotlib.pyplot as plt

def plot_csv(filename, graph_type='line', output_filename='graph.png'):
    # Read CSV file into a pandas DataFrame
    df = pd.read_csv(filename)

    # Determine the type of graph to plot
    if graph_type == 'line':
        df.plot(x=df.columns[0], y=df.columns[1:], kind='line')
    elif graph_type == 'bar':
        df.plot(x=df.columns[0], y=df.columns[1:], kind='bar')
    elif graph_type == 'scatter':
        df.plot(x=df.columns[0], y=df.columns[1:], kind='scatter')
    elif graph_type == 'hist':
        df.plot(y=df.columns[0], kind='hist')
    elif graph_type == 'box':
        df.plot(y=df.columns[1:], kind='box')
    elif graph_type == 'area':
        df.plot(x=df.columns[0], y=df.columns[1:], kind='area')
    elif graph_type == 'pie':
        df[df.columns[0]].plot(kind='pie', labels=df[df.columns[0]], autopct='%1.1f%%')
    elif graph_type == 'hexbin':
        df.plot(x=df.columns[0], y=df.columns[1], kind='hexbin', gridsize=20)
    elif graph_type == 'kde':
        df.plot(y=df.columns[0], kind='kde')
    elif graph_type == 'density':
        df.plot(y=df.columns[0], kind='density')
    else:
        print("Unsupported graph type. Supported types are: line, bar, scatter, hist, box, area, pie, hexbin, kde, density.")
        return

    plt.title('Graph from ' + filename)
    plt.xlabel(df.columns[0])
    plt.ylabel('Values')
    plt.legend()
    
    # Save the plot as an image file
    plt.savefig(output_filename)
    print(f"Graph saved as {output_filename}")

# Example usage:
if __name__ == "__main__":
    filename = 'sample.csv'  # Replace with your CSV file path
    graph_type = 'pie'    # Replace with the type of graph ('line', 'bar', 'scatter', 'hist', 'box', 'area', 'pie', 'hexbin', 'kde', 'density')
    output_filename = 'output_graph.png'  # Replace with desired output file name and extension

    plot_csv(filename, graph_type, output_filename)
